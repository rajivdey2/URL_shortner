require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortId = require('shortid');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// URL Schema
const urlSchema = new mongoose.Schema({
  fullUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, default: shortId.generate }
});
const Url = mongoose.model('Url', urlSchema);

// Create short URL endpoint
app.post('/shorten', async (req, res) => {
  const { fullUrl } = req.body;
  
  try {
    const newUrl = await Url.create({ fullUrl });
    res.json({
      fullUrl: newUrl.fullUrl,
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortUrl}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect endpoint
app.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).json('URL not found');
    
    // Update click counter if needed
    res.redirect(url.fullUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));