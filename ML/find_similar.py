import numpy as np
import pickle
from PIL import Image
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
import os

# Load the model
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Load saved feature vectors and filenames
features = np.load('features.npy')
with open('filenames.pkl', 'rb') as f:
    filenames = pickle.load(f)

# Load and preprocess query image
def extract_feature(img_path):
    img = Image.open(img_path).resize((224, 224)).convert('RGB')
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    feature = model.predict(img_array)[0]
    return feature

# Find similar images
def find_similar_images(query_img_path, top_n=5):
    query_feature = extract_feature(query_img_path)
    similarities = cosine_similarity([query_feature], features)[0]
    top_indices = np.argsort(similarities)[-top_n:][::-1]
    
    print("🔍 Top Similar Products:")
    for idx in top_indices:
        print(f"{filenames[idx]} - Similarity: {similarities[idx]:.4f}")

# ==== USAGE ====
# Replace 'images/query.jpg' with the path of your test image
query_image_path = 'images/query.jpg'
find_similar_images(query_image_path)
