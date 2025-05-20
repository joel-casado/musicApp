const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { title, description, image, isPublic, songs } = req.body;

    // Temporary fallback owner (replace this with auth user later)
    const fallbackUser = await User.findOne(); // First user in DB

    if (!fallbackUser) {
      return res.status(500).json({ message: 'No user found to assign as playlist owner.' });
    }

    const newPlaylist = new Playlist({
      title,
      description,
      image,
      isPublic,
      songs,
      owner: fallbackUser._id,
    });

    await newPlaylist.save();
    res.status(201).json({ message: 'Playlist created successfully!', playlist: newPlaylist });
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ message: 'Error creating playlist', error: err.message });
  }
});

// Optional: Get all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs').populate('owner');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching playlists', error: err.message });
  }
});

module.exports = router;
