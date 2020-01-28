import jwt
from jwt.algorithms import HMACAlgorithm, RSAAlgorithm

with open("/path/to/the/pem/file", 'r') as f:
    secret = f.read().encode()

access_token = ""
decoded = jwt.decode(access_token, secret, algorithms='RS256')
print(decoded)

