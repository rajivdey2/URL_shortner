require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortId = require('shortid');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

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
  
  // Simple URL validation
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
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
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect endpoint
app.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send('URL not found');
    
    res.redirect(url.fullUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server error');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));