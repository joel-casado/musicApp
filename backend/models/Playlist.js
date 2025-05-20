// backend/models/Playlist.js
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  isPublic:    { type: Boolean, default: true },
  image:       { type: String },
  songs:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
