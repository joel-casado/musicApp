let mongoose = require('mongoose');

let playlistSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  isPublic:    { type: Boolean, default: true },
  image:       { type: String },
  songs:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
