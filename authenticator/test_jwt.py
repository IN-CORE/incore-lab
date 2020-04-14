from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError


with open("/path/to/the/pem/file", 'r') as f:
    secret = f.read().encode()

access_token = ""
try:
    decoded = jwt.decode(access_token, secret)
    print(decoded)

except ExpiredSignatureError:
    print('JWT Expired Signature Error: token signature has expired')
except JWTClaimsError:
    print('JWT Claims Error: token signature is invalid')
except JWTError:
    print('JWT Error: token signature is invalid')
except Exception as e:
    print("Not a valid jwt token!")

