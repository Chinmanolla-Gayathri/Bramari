require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const multer = require('multer');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// --- 1. MIDDLEWARE ---
// Put CORS first to handle all connection requests immediately
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser comes next
app.use(express.json({ limit: '50mb' })); 

// --- 2. CONNECT TO MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 3. DEFINE PRODUCT SCHEMA ---
const productSchema = new mongoose.Schema({
  title: String,
  fabric: String,
  color: String,
  pattern: String,
  occasion: String,
  description: String,
  price: Number,
  images: [String], // Array of Base64 strings
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// --- 4. INITIALIZE GEMINI AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

// HELPER: Retry Logic for Gemini
async function generateWithRetry(prompt, imagePart, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      if ((error.message.includes('503') || error.message.includes('Overloaded')) && i < retries - 1) {
        console.log(`⚠️ Gemini busy (503). Retrying... (${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, 2000));
      } else {
        throw error;
      }
    }
  }
}

// --- 5. ROUTES ---

// Route 1: Admin Login Check
app.post('/login', (req, res) => {
  const { password } = req.body;

  if (!process.env.ADMIN_PASSWORD) {
     console.log("❌ ERROR: ADMIN_PASSWORD is missing in Render Environment Variables!");
     return res.status(500).json({ error: "Server config error" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    console.log("✅ Success! Passwords match.");
    res.json({ success: true, message: "Welcome Queen!" });
  } else {
    console.log("⛔ Failed! Passwords do NOT match.");
    res.status(401).json({ success: false, error: "Wrong Password" });
  }
});

// Route 2: Generate Description (MODIFIED FOR DEBUGGING)
app.post('/generate-description', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
        console.log("❌ Error: No images received from Frontend");
        return res.status(400).json({ error: "No images uploaded" });
    }

    const firstFile = req.files[0];
    const imagePart = {
      inlineData: {
        data: firstFile.buffer.toString('base64'),
        mimeType: firstFile.mimetype,
      },
    };

    console.log("✨ Sending image to Gemini..."); // Log progress

    const prompt = `
      You are an expert Indian fashion curator. Analyze this saree.
      Return a STRICT JSON object (no markdown, no backticks) with these keys:
      {
        "title": "A short, elegant title (max 6 words)",
        "fabric": "The primary fabric (e.g., Silk, Cotton, Georgette)",
        "color": "Dominant color",
        "pattern": "Pattern type (e.g., Zari, Floral, Geometric)",
        "occasion": "Best occasion (e.g., Wedding, Festive, Casual)",
        "description": "A crisp, professional 2-sentence description focusing on material and look."
      }
    `;

    let text = await generateWithRetry(prompt, imagePart);
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    console.log("✅ Gemini Success!"); // Log success
    res.json(JSON.parse(text));

  } catch (error) {
    // --- DEBUG: PRINT REAL ERROR TO RENDER LOGS ---
    console.error("❌ CRITICAL GEMINI ERROR:", error);
    res.status(500).json({ error: "AI Failed. Check Render Logs for details." });
  }
});

// Route 3: Create New Product
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Product Save Error:", error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

// Route 4: Get All Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Route 5: Get Single Product
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route 6: Delete Product
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// Route 7: Update Product (EDIT)
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});