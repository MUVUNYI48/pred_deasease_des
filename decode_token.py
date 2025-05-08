import jwt
import datetime

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjM2ODIwLCJpYXQiOjE3NDY2MzIwMjAsImp0aSI6ImEwODA2MTFhNzhiYjQyZjdiOTNiZmJlODIzOTMzOWRjIiwidXNlcl9pZCI6NjJ9.MD8i_Cp7QcZT-BL1W5gNOUuJEU-1Cf81rV7hvdxxSE4"

decoded_token = jwt.decode(token, options={"verify_signature": False})
print("Expiration Time:", datetime.datetime.fromtimestamp(decoded_token["exp"]))
print("Issued At:", decoded_token["iat"])
print("User ID:", decoded_token["user_id"])

print(datetime.datetime.fromtimestamp(decoded_token["iat"]))

import time
print("Token expired:", time.time() > decoded_token["exp"])

