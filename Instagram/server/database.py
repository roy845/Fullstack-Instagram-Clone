from pymongo import MongoClient
from config import settings


client = MongoClient(settings.DATABASE_URI)
print('🚀 Connected to MongoDB...')
db = client.Instagram  # database name
User = db["users"]  # collection name
Photo = db["photos"]  # collection name
Story = db["stories"]  # collection name
Notification = db["notifications"]  # collection name
ResetPasswordToken = db["resetpasswordtokens"]  # collection name
