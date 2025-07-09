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

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGODB_URI")

# Load ResNet50 model for feature extraction
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Get image path from command line
img_path = sys.argv[1]

# Load and preprocess the uploaded image
img = Image.open(img_path).resize((224, 224)).convert('RGB')
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)
query_vector = model.predict(img_array, verbose=0)[0].reshape(1, -1)

# Connect to MongoDB and fetch product data
client = MongoClient(mongo_uri)
db = client['shoplens']
collection = db['products']

# Fetch products
products = list(collection.find({}, {
    '_id': 1,
    'featureVector': 1,
    'title': 1,
    'price': 1,
    'image': 1,
    'link': 1,
    'style': 1
}))

# Extract feature vectors
product_vectors = np.array([p['featureVector'] for p in products])

# Compute cosine similarity
similarities = cosine_similarity(query_vector, product_vectors)[0]
top_indices = np.argsort(similarities)[-10:][::-1]

# Prepare top products
top_products = []
for i in top_indices:
    p = products[i]
    product_data = {
        "_id": p["_id"],
        "title": p.get("title", ""),
        "price": p.get("price", ""),
        "image": p.get("image", ""),
        "link": p.get("link", ""),
        "style": p.get("style", "")
    }
    top_products.append(product_data)

# Debug logs → stderr only (so Node.js doesn't try to parse them)
print("Top products returned by similarity:", file=sys.stderr)
for p in top_products:
    print(f"  -> {p['title']} | style: {p['style']} | id: {p['_id']}", file=sys.stderr)

# ✅ Output only the JSON _id list to stdout
print(json.dumps([str(p['_id']) for p in top_products]))
