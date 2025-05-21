const express = require('express');
const Song = require('../models/Song');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/music'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.use((req, res, next) => {
  console.log('[songs.js]', req.method, req.url, req.body);
  next();
});

router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let query = Song.find({ uploadedBy: userId }).sort({ createdAt: -1 });
    if (req.query.limit) {
      query = query.limit(Number(req.query.limit));
    }
    const songs = await query;
    res.json(songs);
  } catch (err) {
    console.error('Error en GET /user:', err);
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, artist, genre, duration, url, image } = req.body;

    if (!title || !artist || !url) {
      return res.status(400).json({ message: 'Título, artista y URL son obligatorios' });
    }

    const newSong = await Song.create({
      title,
      artist,
      genre,
      duration,
      url,
      image,
      uploadedBy: req.user._id
    });

    res.status(201).json(newSong);
  } catch (err) {
    console.error('Error creando canción:', err);
    res.status(500).json({ message: 'Error interno al crear canción' });
  }
});

router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error listando canciones:', err);
    res.status(500).json({ message: 'Error interno al listar canciones' });
  }
});

router.post('/upload', auth, upload.single('audio'), async (req, res) => {
  try {
    const { title, artist, genre, duration, image } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }
    const url = `http://localhost:5000/music/${req.file.filename}`;
    const newSong = await Song.create({
      title,
      artist,
      genre,
      duration,
      url,
      image,
      uploadedBy: req.user._id
    });
    res.status(201).json(newSong);
  } catch (err) {
    console.error('Error uploading song:', err);
    res.status(500).json({ message: 'Error uploading song' });
  }
});

module.exports = router;
