// routes/urls.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const Url = require("../models/Url");

// Middleware to check JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Create short URL
router.post("/shorten", verifyToken, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortUrl = generateShortUrl();
    const userId = req.userId;

    const url = new Url({ originalUrl, shortUrl, user: userId });
    await url.save();

    res.status(201).json({ shortUrl });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve all URLs for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const urls = await Url.find({ user: userId });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve a specific URL
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const url = await Url.findOne({ _id: req.params.id, user: userId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json(url);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update URL (e.g., change the original URL)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const url = await Url.findOne({ _id: req.params.id, user: userId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.originalUrl = req.body.originalUrl;
    await url.save();

    res.json({ message: "URL updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete URL
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const url = await Url.findOne({ _id: req.params.id, user: userId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    await url.remove();

    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Redirect to original URL and track visit
router.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.visits++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to generate a random short URL (you may implement this according to your requirements)
const generateShortUrl = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = router;
