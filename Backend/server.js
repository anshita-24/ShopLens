const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads/ and public/products/
app.use('/uploads', express.static('uploads'));
app.use('/products', express.static(path.join(__dirname, 'public/products')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Product Schema
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  image: String,
  price: String,
  link: String,
  style: String,
  featureVector: [Number]
}));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// POST /upload-image
app.post('/upload-image', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = path.join(__dirname, req.file.path);

  try {
    const { spawn } = require('child_process');
    const py = spawn(
      'C:/Users/Hp/OneDrive/Desktop/ShopLens/ML/venv310/Scripts/python.exe',
      [path.join(__dirname, '../ml/find_similar.py'), imagePath]
    );

    let data = '';
    py.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on('data', (err) => {
      console.error(`⚠️ Python error: ${err}`);
    });

    py.on('close', async () => {
      try {
        console.log('🐍 Raw Python output:', data);
        const similarIds = JSON.parse(data);
        const objectIds = similarIds.map(id => new ObjectId(id));

        const matchedProducts = await Product.find({ _id: { $in: objectIds } });
        if (!matchedProducts.length) {
          console.log("❌ No products matched those IDs");
          return res.json({ similarProducts: [] });
        }

        const matchedStyle = matchedProducts[0].style;
        console.log("📎 Extracted Style:", matchedStyle);

        const filteredProducts = matchedProducts.filter(p => p.style === matchedStyle);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // ✅ Attach imageUrl to each product
        const result = filteredProducts.map(p => ({
          ...p.toObject(),
          imageUrl: imageUrl
        }));

        res.json({
          uploaded: req.file.originalname,
          imageUrl,
          similarProducts: result
        });
      } catch (e) {
        console.error('❌ JSON parse error or fetch error:', e);
        res.status(500).json({ error: 'Failed to parse or filter similar products' });
      }
    });

  } catch (e) {
    res.status(500).json({ error: 'Something went wrong with ML pipeline' });
  }
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('🚀 ShopLens Backend is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
