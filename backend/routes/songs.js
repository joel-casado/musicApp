// backend/routes/songs.js
const express = require('express');
const Song    = require('../models/Song');
const router  = express.Router();

router.use((req, res, next) => {
  console.log('[songs.js]', req.method, req.url, req.body);
  next();
});

// POST /api/songs  → Crear una canción nueva
router.post('/', async (req, res) => {
  console.log('BODY:', req.body); 
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
      image        // ahora guardas la URL aquí
    });
    res.status(201).json(newSong);
  } catch (err) {
    console.error('Error creando canción:', err);
    res.status(500).json({ message: 'Error interno al crear canción' });
  }
});

// GET /api/songs → Listar todas las canciones
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error listando canciones:', err);
    res.status(500).json({ message: 'Error interno al listar canciones' });
  }
});

module.exports = router;
