## INSTALL customauthenticator
- install python-jose `pip install python-jose`
- inside the /authenticator directory, do a `pip install . -U`
- the installed package can be imported by command `from authenticator.custom import CustomTokenAuthenticator`

## CONFIGURE jupyterhub
- modify the `jupyterhub_config.py` line 90 - 96:
    1. keycloak_pem_key_path should point to the absolute path that contains the keycloak RSA public key
    2. auth_cookie_header is the cookie key 
    3. auth_username_key is the field name of the username
    4. landing_page_login_url should point to the login page url; if token failed or not existing, jupyterhub will 
    direct user to that URL
    
## GET public key from keycloak
- https://incore-dev-kube.ncsa.illinois.edu/auth/admin/master/console/#/realms/In-core/keys click Public key under 
RS256
- save it in a file with -----BEGIN PUBLIC KEY----- and -----END PUBLIC KEY----- appending on the top and bottom of 
the file
- record the path of where this file is, this should be put in as the parameter *keycloak_pem_key_path* in the 
jupyterhub_config.py file

## RUN jupyterhub with configuration
- `jupyterhub -f path_to_/jupyterhub_config.py`