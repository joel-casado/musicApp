const mongoose = require('mongoose');
const playlistSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  songs:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
