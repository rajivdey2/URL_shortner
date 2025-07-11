require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortId = require('shortid');

const app = express();

// Improved CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://url-shortner2-88wp.vercel.app' // REPLACE WITH YOUR ACTUAL FRONTEND URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// URL Schema
const urlSchema = new mongoose.Schema({
  fullUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, default: shortId.generate },
  createdAt: { type: Date, default: Date.now }
});
const Url = mongoose.model('Url', urlSchema);

// Create short URL endpoint
app.post('/api/shorten', async (req, res) => {
  const { fullUrl } = req.body;
  
  // Enhanced URL validation
  try {
    new URL(fullUrl);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const existingUrl = await Url.findOne({ fullUrl });
    if (existingUrl) {
      return res.json({
        fullUrl: existingUrl.fullUrl,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortUrl}`
      });
    }

    const newUrl = await Url.create({ fullUrl });
    res.json({
      fullUrl: newUrl.fullUrl,
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortUrl}`
    });
  } catch (error) {
    console.error('Shorten error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Redirect endpoint
app.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send('URL not found');
    
    // Update click counter (optional)
    res.redirect(url.fullUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server error');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));