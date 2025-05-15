const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  artist:     String,
  genre:      String,
  duration:   Number,
  url:        String,
  image:      String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
