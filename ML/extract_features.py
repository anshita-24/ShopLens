import os
import numpy as np
import pickle
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from PIL import Image

# Load pre-trained model without the final classification layer
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Folder where images are stored
image_folder = 'images'
features = []
filenames = []

for img_name in os.listdir(image_folder):
    img_path = os.path.join(image_folder, img_name)
    img = Image.open(img_path).resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    feature_vector = model.predict(img_array)
    features.append(feature_vector[0])
    filenames.append(img_name)

# Save features and filenames
np.save('features.npy', np.array(features))

with open('filenames.pkl', 'wb') as f:
    pickle.dump(filenames, f)

print("✅ Features and filenames saved successfully!")
