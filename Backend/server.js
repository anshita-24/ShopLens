const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file

const app = express();
app.use(cors());

// Serve static files from uploads/ so they are viewable in browser
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Product Schema
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  similar: [String],
  imageUrl: String
}));

// Setup multer with file extension preserved
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

  // Log basic file info
  console.log('📥 Received file:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  // Extract base name of the image for mock use
  const baseName = req.file.originalname.split('.')[0];

  // Generate dummy similar items
  const similarItems = [`${baseName} A`, `${baseName} B`, `${baseName} C`];

  // Create full image URL
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Save product in DB
  const product = new Product({
    name: baseName,
    similar: similarItems,
    imageUrl
  });

  await product.save();

  // Send response
  res.json({
    product: product.name,
    similar: product.similar,
    imageUrl: product.imageUrl
  });
});


// Endpoint: GET /products – Returns all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
//app.post('/test', (req, res) => {
  //res.json({ message: '✅ Test POST route works!' });
//});


// Root test route
app.get('/', (req, res) => {
  res.send('🚀 ShopLens Backend is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
