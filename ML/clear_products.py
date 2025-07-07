from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv(dotenv_path="../backend/.env")  # adjust path if needed
mongo_uri = os.getenv("MONGODB_URI")

# Connect to MongoDB Atlas
client = MongoClient(mongo_uri)
db = client['shoplens']
collection = db['products']

# Delete all documents from the collection
result = collection.delete_many({})

print(f"🧹 Deleted {result.deleted_count} products from MongoDB.")
