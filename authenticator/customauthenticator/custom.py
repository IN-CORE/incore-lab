import os
import urllib.parse
import json

from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError
from jupyterhub.auth import Authenticator
from jupyterhub.handlers import LoginHandler, LogoutHandler
from traitlets import Unicode
from tornado import web


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

    auth_uid_number_key = Unicode(
        os.environ.get('AUTH_UID_NUMBER_KEY', ''),
        config=True,
        help="the key to retreive uid from the json",
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
            (r'/', LoginHandler),
            (r'/user', LoginHandler),
            (r'/lab', LoginHandler),
            (r'/login', LoginHandler),
            (r'/logout', LogoutHandler),
        ]

    def get_keycloak_pem(self):
        if not self.keycloak_url:
            raise web.HTTPError(500, log_messag="JupyterHub is not correctly configured.")

        # fetch the key
        response = urllib.request.urlopen(self.keycloak_url)
        if response.code >= 200 or response <= 299:
            encoding = response.info().get_content_charset('utf-8')
            result = json.loads(response.read().decode(encoding))
            self.keycloak_pem_key = f"-----BEGIN PUBLIC KEY-----\n" \
                                    f"{result['public_key']}\n" \
                                    f"-----END PUBLIC KEY-----"
        else:
            raise web.HTTPError(500, log_messag="Could not get key from keycloak.")

    def check_jwt_token(self, access_token):
        # make sure we have the pem cert
        if not self.keycloak_pem_key:
            self.get_keycloak_pem()

        # make sure audience is set
        if not self.keycloak_audience:
            raise web.HTTPError(403, log_messag="JupyterHub is not correctly configured.")

        # no token in the cookie
        if not access_token:
            raise web.HTTPError(401, log_messag="Please login to access IN-CORE Lab.")

        # make sure it is a valid token
        if len(access_token.split(" ")) != 2 or access_token.split(" ")[0] != 'bearer':
            raise web.HTTPError(403, log_messag="Token format not valid, it has to be bearer xxxx!")

        # decode jwt token instead of sending it to userinfo endpoint:
        access_token = access_token.split(" ")[1]
        public_key = self.keycloak_pem_key
        audience = self.keycloak_audience
        try:
            resp_json = jwt.decode(access_token, public_key, audience=audience)
        except ExpiredSignatureError:
            raise web.HTTPError(403, log_messag='JWT Expired Signature Error: token signature has expired')
        except JWTClaimsError:
            raise web.HTTPError(403, log_messag='JWT Claims Error: token signature is invalid')
        except JWTError:
            raise web.HTTPError(403, log_messag='JWT Error: token signature is invalid')
        except Exception as e:
            raise web.HTTPError(403, log_messag="Not a valid jwt token!")

        # make sure we know username
        if self.auth_username_key not in resp_json.keys():
            raise web.HTTPError(500, log_messag=f"Required field {self.auth_username_key} does not exist in jwt token")
        username = resp_json[self.auth_username_key]

        # make sure there is a user id
        if self.auth_uid_number_key not in resp_json.keys():
            raise web.HTTPError(500, log_messag=f"Required field {self.auth_uid_number_key} does not exist in jwt token")
        uid = resp_json[self.auth_uid_number_key]

        # get the groups/roles for the user
        user_groups = resp_json.get("groups", [])
        if "roles" in resp_json:
            user_roles = resp_json.get("roles", [])
        elif "realm_access" in resp_json:
            user_roles = resp_json["realm_access"].get("roles", [])
        else:
            user_roles = []

        # check authorization
        if "incore_jupyter" not in user_groups and "incore_jupyter" not in user_roles:
            raise web.HTTPError(403, log_messag="The current user does not belongs to incore jupyter lab group and " +
                                                "cannot access incore lab. Please contact NCSA IN-CORE development team")

        admin = False
        if "incore_admin" in user_groups and "incore_admin" in user_roles:
            admin = True

        self.log.info(f"username={username} logged in with uid={uid}")
        return {
            'name': username,
            'admin': admin,
            'auth_state': {
                'uid': uid,
                'groups': user_groups,
                'roles': user_roles,
            },
        }

    async def authenticate(self, handler, data):
        self.log.info("Authenticate")
        try:
            access_token = urllib.parse.unquote(handler.get_cookie(self.auth_cookie_header, ""))
            if not access_token:
                raise web.HTTPError(401, log_messag="Please login to access IN-CORE Lab.")

            # check token and authorization
            user = self.check_jwt_token(access_token)
            return user
        except web.HTTPError as e:
            if e.log_message:
                error_msg = urllib.parse.quote(e.log_message.encode('utf-8'))
            else:
                error_msg = urllib.parse.quote(f"Error {e}".encode('utf-8'))
            handler.redirect(f"{self.landing_page_login_url}?error={error_msg}")

    async def pre_spawn_start(self, user, spawner):
        auth_state = await user.get_auth_state()
        if not auth_state:
            self.log.error("No auth state")
            return
        spawner.environment['NB_USER'] = user.name
        spawner.environment['NB_UID'] = str(auth_state['uid'])
        self.log.info(str(spawner.environment))
