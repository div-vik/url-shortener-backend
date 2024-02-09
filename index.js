// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/urls", require("./routes/urls"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
