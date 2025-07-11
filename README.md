# 🛍️ ShopLens – Your Visual AI Shopping Assistant ;) 

**ShopLens** helps users find visually similar products on **Walmart** by simply uploading or clicking a picture of an item they don’t know the name of. Whether it’s a piece of furniture, an electronic gadget, a kitchen tool, or a fashion item — ShopLens uses image-based search powered by machine learning to connect users with lookalike products directly from Walmart.

---

## 📸 How It Works – Visual Product Search

### Step 1: Upload or Click a Picture  
> *"I found this cool product, but I don’t know what it's called!"*  
📷 Upload or click a picture of any unknown item directly in the app.

🖼️ `...space for image/screenshot of our prototype interface...`

---

### Step 2: Image Feature Extraction  
🔬 Our ML pipeline processes the image and extracts its visual features using pretrained models like ResNet or CNN variants. These features are then converted into vectors.

🖼️ `...space for image/screenshot showing ML processing...`

---

### Step 3: Find Similar Products  
🧠 Using cosine similarity, we match the vector against a dataset of Walmart products and retrieve the most visually similar items.

🖼️ `...space for image/screenshot showing matching results...`

---

### Step 4: Visit Product Page  
🔗 Want to buy it? Click the result and get redirected to the official Walmart product page.

🖼️ `...space for image/screenshot showing redirection link or Walmart UI...`

---

### 🛒 Enjoi Shopping!  
![ Shopping Giphy](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3c4YjlmanM4YzR3MTF3Z3N4emhmcHM0cHVnMWlmaHFhb2ZlcG5zNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ov9jSVZW5EkTUnzeE/giphy.gif)

---

## ⚙️ Features

- 🧠 AI/ML powered product similarity detection
- 🔍 Visual search for any item — not just fashion
- 🔗 Live redirection to Walmart product links
- 🌐 Built with modern web tools (Vite + React + Tailwind)
- 💡 Scalable, modular project structure
- 🎯 Ideal for visually-driven shopping experiences

---

## 💡 Why These Tech Stacks? – Q&A Format

**Q: Why React + Vite in frontend?**  
🟢 Vite offers blazing-fast HMR and React helps build modular UIs.

**Q: Why Tailwind CSS?**  
🟢 We needed utility-first, responsive design without writing custom CSS.

**Q: Why Node.js and Express for backend?**  
🟢 Lightweight and perfect for serving APIs and handling image-to-ML script routing.

**Q: Why Python for ML?**  
🟢 Python provides a rich ecosystem (NumPy, sklearn, OpenCV) for image feature processing and similarity search.

**Q: Why Walmart?**  
🟢 Easy access to product data, wide category range, and real-world impact with link-based redirection.

---

## 🛠️ How to Run Locally

### 🔧 Backend
```bash
cd Backend
npm install
node server.js
🎨 Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
🧠 ML Scripts (Python)
bash
Copy
Edit
cd ML
python clear_products.py         # Clean product data
python extract_features.py       # Generate embeddings
python find_similar.py           # Find visually similar Walmart products
🔮 Future Additions
🔐 User Authentication

🌍 Support for Amazon and Flipkart

📱 Mobile PWA version

🧠 CLIP/DINOv2 integration for better results

🙌 Built With Love
Made by Anshima Singh
Drop a ⭐ if you liked it, or feel free to contribute!

📄 License
MIT License © 2025 ShopLens
