const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Create a new playlist
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, isPublic, songs } = req.body;
    const userId = req.user._id; // <-- get user from token

    const newPlaylist = new Playlist({
      title,
      description,
      image,
      isPublic,
      songs,
      owner: userId, // <-- assign owner
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

// Get last 5 playlists for the authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let query = Playlist.find({ owner: userId }).sort({ createdAt: -1 });
    if (req.query.limit) {
      query = query.limit(Number(req.query.limit));
    }
    const playlists = await query;
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user playlists', error: err.message });
  }
});

// 1. Place this FIRST:
router.get('/public', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const playlists = await Playlist.find({
      isPublic: true,
      owner: { $ne: userId }
    }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching public playlists', error: err.message });
  }
});

// 2. Place this AFTER:
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs').populate('owner');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching playlist', error: err.message });
  }
});

module.exports = router;
