import sys
import os
import numpy as np
import json
from PIL import Image
from dotenv import load_dotenv
from pymongo import MongoClient
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()
mongo_uri = os.getenv("MONGODB_URI")

# Load ResNet50 model
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Get image path from command line
img_path = sys.argv[1]

# Load and preprocess image
img = Image.open(img_path).resize((224, 224)).convert('RGB')
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)
query_vector = model.predict(img_array)[0].reshape(1, -1)

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['shoplens']
collection = db['products']


# Fetch all products and their feature vectors
products = list(collection.find({}, {'_id': 0}))  # exclude _id
product_vectors = np.array([p['featureVector'] for p in products])

# Compute similarity
similarities = cosine_similarity(query_vector, product_vectors)[0]
top_indices = np.argsort(similarities)[-5:][::-1]

# Return top 5 similar products
top_products = [products[i] for i in top_indices]
print(json.dumps(top_products))
