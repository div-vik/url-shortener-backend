// models/Url.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Url", urlSchema);
