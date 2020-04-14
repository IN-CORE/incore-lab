from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError
import os

public_key = f"-----BEGIN PUBLIC KEY-----\n"\
             f"{str(os.environ.get('KEYCLOAK_PUBLIC_KEY'))}"\
             f"\n-----END PUBLIC KEY-----"
access_token = ""

try:
    decoded = jwt.decode(access_token, public_key)
    print(decoded)

except ExpiredSignatureError:
    print('JWT Expired Signature Error: token signature has expired')
except JWTClaimsError:
    print('JWT Claims Error: token signature is invalid')
except JWTError:
    print('JWT Error: token signature is invalid')
except Exception as e:
    print("Not a valid jwt token!")

