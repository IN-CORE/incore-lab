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

    auth_group = Unicode(
        os.environ.get('AUTH_GROUP', ''),
        config=True,
        help="the user group for incore jupyterhub authenticator"
    )

    auth_role = Unicode(
        os.environ.get('AUTH_ROLE', ''),
        config=True,
        help="the user role for incore jupyterhub authenticator"
    )

    quotas = None

    def get_handlers(self, app):
        return [
            (r'/', LoginHandler),
            (r'/user', LoginHandler),
            (r'/lab', LoginHandler),
            (r'/login', LoginHandler),
            (r'/logout', CustomTokenLogoutHandler),
        ]

    def get_keycloak_pem(self):
        if not self.keycloak_url:
            raise web.HTTPError(500, log_message="JupyterHub is not correctly configured.")

        # fetch the key
        response = urllib.request.urlopen(self.keycloak_url)
        if response.code >= 200 or response <= 299:
            encoding = response.info().get_content_charset('utf-8')
            result = json.loads(response.read().decode(encoding))
            self.keycloak_pem_key = f"-----BEGIN PUBLIC KEY-----\n" \
                                    f"{result['public_key']}\n" \
                                    f"-----END PUBLIC KEY-----"
        else:
            raise web.HTTPError(500, log_message="Could not get key from keycloak.")

    def check_jwt_token(self, access_token):
        # make sure we have the pem cert
        if not self.keycloak_pem_key:
            self.get_keycloak_pem()

        # make sure audience is set
        if not self.keycloak_audience:
            raise web.HTTPError(403, log_message="JupyterHub is not correctly configured.")

        # no token in the cookie
        if not access_token:
            raise web.HTTPError(401, log_message="Please login to access IN-CORE Lab.")

        # make sure it is a valid token
        if len(access_token.split(" ")) != 2 or access_token.split(" ")[0] != 'bearer':
            raise web.HTTPError(403, log_message="Token format not valid, it has to be bearer xxxx!")

        # decode jwt token instead of sending it to userinfo endpoint:
        access_token = access_token.split(" ")[1]
        public_key = self.keycloak_pem_key
        audience = self.keycloak_audience
        try:
            resp_json = jwt.decode(access_token, public_key, audience=audience)
        except ExpiredSignatureError:
            raise web.HTTPError(403, log_message='JWT Expired Signature Error: token signature has expired')
        except JWTClaimsError:
            raise web.HTTPError(403, log_message='JWT Claims Error: token signature is invalid')
        except JWTError:
            raise web.HTTPError(403, log_message='JWT Error: token signature is invalid')
        except Exception as e:
            raise web.HTTPError(403, log_message="Not a valid jwt token!")

        # make sure we know username
        if self.auth_username_key not in resp_json.keys():
            raise web.HTTPError(500, log_message=f"Required field {self.auth_username_key} does not exist in jwt token")
        username = resp_json[self.auth_username_key]

        # make sure there is a user id
        if self.auth_uid_number_key not in resp_json.keys():
            raise web.HTTPError(500, log_message=f"Required field {self.auth_uid_number_key} does not exist in jwt token")
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
        if self.auth_group not in user_groups and self.auth_role not in user_roles:
            raise web.HTTPError(403, log_message="The current user does not belongs to incore user group and " +
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
                raise web.HTTPError(401, log_message="Please login to access IN-CORE Lab.")

            # check token and authorization
            user = self.check_jwt_token(access_token)
            return user
        except web.HTTPError as e:
            if e.log_message:
                error_msg = urllib.parse.quote(e.log_message.encode('utf-8'))
            else:
                error_msg = urllib.parse.quote(f"Error {e}".encode('utf-8')) + ". Please login to access IN-CORE Lab."
            handler.redirect(f"{self.landing_page_login_url}?error={error_msg}")

    def find_quota(self, user, auth_state):
        # TODO need to store the parameters in a config that can be retrieved
        #      one option is to put this in the frontend and all applications
        #      can read it from there.
        if not self.quotas:
            try:
                self.quotas = json.load(open("/etc/quota.json"))
            except:
                self.log.exception("Could not load quota")
                self.quotas = {}

        if "users" in self.quotas and user.name in self.quotas["users"]:
            return self.quotas["users"][user.name]
        if "groups" in self.quotas:
            for group, quota in sorted(self.quotas["groups"].items(), key=lambda x: x[1].get("weight", 0), reverse=True):
                if group in auth_state["groups"]:
                    return quota
        if "default" in self.quotas:
            return self.quotas["default"]

        # default quotas
        return { "cpu": [ 1, 2 ], "mem": [ 2, 4 ], "disk": 4, "service": [100, 2]}

    async def pre_spawn_start(self, user, spawner):
        auth_state = await user.get_auth_state()
        if not auth_state:
            self.log.error("No auth state")
            return

        spawner.environment['NB_USER'] = user.name
        spawner.environment['NB_UID'] = str(auth_state['uid'])

        quota = self.find_quota(user, auth_state)
        if "cpu" in quota:
            spawner.cpu_guarantee = quota["cpu"][0]
            spawner.cpu_limit = quota["cpu"][1]
        else:
            spawner.cpu_guarantee = 1
            spawner.cpu_limit = 2
        if "mem" in quota:
            spawner.mem_guarantee = f"{quota['mem'][0]}G"
            spawner.mem_limit = f"{quota['mem'][1]}G"
        else:
            spawner.mem_guarantee = "2G"
            spawner.mem_limit = "4G"

#
#    # This is called from the jupyterlab so there is no cookies that this depends on
#    async def refresh_user(self, user, handler):
#        self.log.info("Refresh User")
#        try:
#            access_token = urllib.parse.unquote(handler.get_cookie(self.auth_cookie_header, ""))
#            # if no token present
#            if not access_token:
#                return False
#
#            # if token present, check token and authorization
#            if self.check_jwt_token(access_token):
#                True
#            return False
#        except:
#            self.log.exception("Error in refresh user")
#            return False


class CustomTokenLogoutHandler(LogoutHandler):

    async def handle_logout(self):
        # remove incore token on logout
        self.log.info("Remove incore token on logout")
        error_msg = "You have logged out of IN-CORE system from IN-CORE lab. Please login again if you want to use " \
                    "IN-CORE components."
        self.set_cookie(self.authenticator.auth_cookie_header, "")
        self.redirect(f"{self.authenticator.landing_page_login_url}?error={error_msg}")

