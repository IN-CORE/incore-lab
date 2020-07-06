import os
import urllib.parse

from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError
from jupyterhub.auth import Authenticator
from jupyterhub.handlers import BaseHandler
from jupyterhub.utils import url_path_join
from tornado import gen
from traitlets import Unicode


class CustomTokenLoginHandler(BaseHandler):

    def get(self):

        self.clear_login_cookie()
        access_token = urllib.parse.unquote(self.get_cookie(self.authenticator.auth_cookie_header, ""))
        error_params = {'error': None}

        # no token in the cookie
        if not access_token:
            error_params['error'] = "No token presented in the cookie!"
            _url = self.authenticator.landing_page_login_url

        elif len(access_token.split(" ")) != 2 or access_token.split(" ")[0] != 'bearer':
            error_params['error'] = "Token format not valid, it has to be bearer xxxx!"
            _url = self.authenticator.landing_page_login_url
        else:
            # decode jwt token instead of sending it to userinfo endpoint:
            access_token = access_token.split(" ")[1]
            public_key = self.authenticator.keycloak_pem_key

            try:
                resp_json = jwt.decode(access_token, public_key)
                user_groups = resp_json.get("groups", [])
                if "roles" in resp_json:
                    user_roles = resp_json.get("roles", [])
                elif "realm_access" in resp_json:
                    user_roles = resp_json["realm_access"].get("roles", [])
                else:
                    user_roles = []

                if "incore_jupyter" not in user_groups and "incore_jupyter" not in user_roles:
                    error_params['error'] = "The current user does not belongs to incore jupyter lab group and cannot "
                    + "access incore lab"
                    _url = self.authenticator.landing_page_login_url
                elif self.authenticator.auth_username_key not in resp_json:
                    error_params = "required field " + self.authenticator.auth_username_key
                          + " does not exist in the decoded object!"
                    _url = self.authenticator.landing_page_login_url
                else:
                    username = resp_json[self.authenticator.auth_username_key]
                    user = self.user_from_username(username)
                    self.set_login_cookie(user)

                    _url = url_path_join(self.hub.server.base_url, 'home')
                    next_url = self.get_argument('next', default=False)
                    if next_url:
                        _url = next_url

            except ExpiredSignatureError:
                error_params['error'] = 'JWT Expired Signature Error: token signature has expired'
                _url = self.authenticator.landing_page_login_url
            except JWTClaimsError:
                error_params['error'] = 'JWT Claims Error: token signature is invalid'
                _url = self.authenticator.landing_page_login_url
            except JWTError:
                error_params['error'] = 'JWT Error: token signature is invalid'
                _url = self.authenticator.landing_page_login_url
            except Exception as e:
                error_params['error'] = "Not a valid jwt token!"
                _url = self.authenticator.landing_page_login_url

        self.redirect(_url + "?" + urllib.parse.urlencode(error_params)


class CustomTokenLogoutHandler(BaseHandler):

    def get(self):
        self.clear_login_cookie()
        self.set_cookie(self.authenticator.auth_cookie_header, "")


class CustomTokenAuthenticator(Authenticator):
    """
        Accept the authenticated Access Token from cookie.
    """
    auth_cookie_header = Unicode(
        os.environ.get('AUTH_COOKIE_HEADER', ''),
        config=True,
        help="the cookie header we put in browser to retrieve token",
    )

    auth_username_key = Unicode(
        os.environ.get('AUTH_USERNAME_KEY', ''),
        config=True,
        help="the key to retreive username from the json",
    )

    landing_page_login_url = Unicode(
        os.environ.get('LANDING_PAGE_LOGIN_URL', ''),
        config=True,
        help="the landing page login entry",
    )

    keycloak_pem_key = Unicode(
        os.environ.get('KEYCLOAK_PEM_KEY', ''),
        config=True,
        help="the RSA pem key with proper header and footer",
    )

    def get_handlers(self, app):
        return [
            (r'/', CustomTokenLoginHandler),
            (r'/user', CustomTokenLoginHandler),
            (r'/lab', CustomTokenLoginHandler),
            (r'/login', CustomTokenLoginHandler),
            (r'/logout', CustomTokenLogoutHandler),
        ]

    @gen.coroutine
    def authenticate(self, *args):
        raise NotImplementedError()


