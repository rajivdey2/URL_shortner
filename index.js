const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { nanoid } = require("nanoid");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB Error:", err));

// Schema
const urlSchema = new mongoose.Schema({
  shortId: String,
  longUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);

// POST /api/shorten
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl || !/^https?:\/\//i.test(longUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortId = nanoid(6);
  const base = process.env.BASE_URL;

  const shortUrl = `${base}/${shortId}`;

  await Url.create({ shortId, longUrl });
  res.json({ shortUrl });
});

// GET /:shortId → Redirect
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const urlDoc = await Url.findOne({ shortId });

  if (!urlDoc) return res.status(404).send("Link not found");

  res.redirect(urlDoc.longUrl);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
