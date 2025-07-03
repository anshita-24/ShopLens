import os
import json
import numpy as np
from PIL import Image
from pymongo import MongoClient
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image

from dotenv import load_dotenv

load_dotenv(dotenv_path="../backend/.env")
mongo_uri = os.getenv("MONGODB_URI")
# 🧠 Load ResNet50 model
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# 📂 Path to image folder and metadata file
image_folder = '../backend/public/products'
json_path = '../backend/data/mockProducts.json'


# 🍃 Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['shoplens']
collection = db['products']

# 🔁 Load metadata
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)



# 🎯 Extract and insert features
for product in products:
    img_path = os.path.join(image_folder, product['image'])
    try:
        img = Image.open(img_path).resize((224, 224)).convert('RGB')
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # Extract feature vector
        feature_vector = model.predict(img_array)[0].tolist()  # convert to list for MongoDB

        # Add feature vector to product data
        product['featureVector'] = feature_vector

        # Insert into MongoDB
        collection.insert_one(product)

        print(f"✅ Inserted: {product['title']}")
    except Exception as e:
        print(f"❌ Failed for {product['image']}: {e}")

print("\n🎉 All product features stored in MongoDB!")
