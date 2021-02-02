import os
import urllib.parse
import json

from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError
from jupyterhub.auth import Authenticator
from jupyterhub.handlers import BaseHandler
from jupyterhub.utils import url_path_join
from tornado import gen
from traitlets import Unicode


class CustomTokenLoginHandler(BaseHandler):

    def login_error(self, error_msg="Unknown error"):
        url = self.authenticator.landing_page_login_url
        self.redirect(url + "?error=" + urllib.parse.quote(error_msg))

    def get(self):
        self.clear_login_cookie()
        access_token = urllib.parse.unquote(self.get_cookie(self.authenticator.auth_cookie_header, ""))

        # make sure we have the pem cert
        if not self.authenticator.keycloak_pem_key:
            if not self.authenticator.keycloak_url:
                self.login_error("JupyterHub is not correctly configured.")
                return

            # fetch the key
            response = urllib.request.urlopen(self.authenticator.keycloak_url)
            if response.code >= 200 or response <= 299:
                encoding = response.info().get_content_charset('utf-8')
                result = json.loads(response.read().decode(encoding))
                self.authenticator.keycloak_pem_key = f"-----BEGIN PUBLIC KEY-----\n" \
                                                      f"{result['public_key']}\n" \
                                                      f"-----END PUBLIC KEY-----"
            else:
                self.login_error("Could not get key.")
                return

        # make sure audience is set
        if not self.authenticator.keycloak_audience:
            self.login_error("JupyterHub is not correctly configured.")
            return

        # no token in the cookie
        if not access_token:
            self.login_error("Please login to access IN-CORE Lab.")
            return

        # make sure it is a valid token
        if len(access_token.split(" ")) != 2 or access_token.split(" ")[0] != 'bearer':
            self.login_error("Token format not valid, it has to be bearer xxxx!")
            return

        # decode jwt token instead of sending it to userinfo endpoint:
        access_token = access_token.split(" ")[1]
        public_key = self.authenticator.keycloak_pem_key
        audience = self.authenticator.keycloak_audience
        try:
            resp_json = jwt.decode(access_token, public_key, audience=audience)
        except ExpiredSignatureError:
            self.login_error('JWT Expired Signature Error: token signature has expired')
            return
        except JWTClaimsError:
            self.login_error('JWT Claims Error: token signature is invalid')
            return
        except JWTError:
            self.login_error('JWT Error: token signature is invalid')
            return
        except Exception as e:
            self.login_error("Not a valid jwt token!")
            return

        # make sure we know username
        if self.authenticator.auth_username_key not in resp_json.keys():
            self.login_error(f"Required field {self.authenticator.auth_username_key} does not exist in jwt token")
            return

        # authorization
        user_groups = resp_json.get("groups", [])
        if "roles" in resp_json:
            user_roles = resp_json.get("roles", [])
        elif "realm_access" in resp_json:
            user_roles = resp_json["realm_access"].get("roles", [])
        else:
            user_roles = []
        if "incore_jupyter" not in user_groups and "incore_jupyter" not in user_roles:
            self.login_error("The current user does not belongs to incore jupyter lab group and " +
                             "cannot access incore lab. Please contact NCSA IN-CORE development team")
            return

        # user is logged in
        username = resp_json[self.authenticator.auth_username_key]
        user = self.user_from_username(username)
        self.set_login_cookie(user)

        # goto home page or next url
        home = url_path_join(self.hub.server.base_url, 'home')
        self.redirect(self.get_argument('next', default=home))


class CustomTokenLogoutHandler(BaseHandler):

    def get(self):
        self.clear_login_cookie()
        self.set_cookie(self.authenticator.auth_cookie_header, "")

        # redirect to landing page
        _url = self.authenticator.landing_page_login_url
        self.redirect(_url)


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

    keycloak_url = Unicode(
        os.environ.get('KEYCLOAK_URL', ''),
        config=True,
        help="the URL where keycloak is installed",
    )

    keycloak_audience = Unicode(
        os.environ.get('KEYCLOAK_AUDIENCE', ''),
        config=True,
        help="the audience for keycloak to check",
    )

    keycloak_pem_key = Unicode(
        os.environ.get('KEYCLOAK_PEM_KEY', ''),
        config=True,
        help="the RSA pem key with proper header and footer (deprecated)",
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


