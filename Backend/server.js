const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON body

// Serve static files from uploads/ and public/products/
app.use('/uploads', express.static('uploads'));
app.use('/products', express.static(path.join(__dirname, 'public/products')));

// MongoDB connection using Atlas URI from .env
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
  featureVector: [Number] // store array of floats
}));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// Endpoint: POST /upload-image
app.post('/upload-image', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = path.join(__dirname, req.file.path);

  try {
    // Call Python script to find similar products
    const { spawn } = require('child_process');
    const py = spawn('python', ['../ml/find_similar.py', imagePath]);

    let data = '';
    py.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on('data', (err) => {
      console.error(`⚠️ Python error: ${err}`);
    });

    py.on('close', (code) => {
      try {
        const similarProducts = JSON.parse(data);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
          uploaded: req.file.originalname,
          imageUrl,
          similar: similarProducts
        });
      } catch (e) {
        console.error('❌ JSON parse error:', e);
        res.status(500).json({ error: 'Failed to parse Python response' });
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong with ML pipeline' });
  }
});

// Endpoint: GET /products
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