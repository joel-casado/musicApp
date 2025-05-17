const express = require('express');
const Song = require('../models/Song');
const router = express.Router();

// 🧪 Log de todas las peticiones
router.use((req, res, next) => {
  console.log('[songs.js]', req.method, req.url, req.body);
  next();
});

// 🔄 GET /api/songs/user → Últimas 5 canciones del usuario fijo
router.get('/user', async (req, res) => {
  try {
    const userId = '6828d16165d027365213f979'; // ID del usuario fijo
    const songs = await Song.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(songs);
  } catch (err) {
    console.error('Error en GET /user:', err);
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
});

// ➕ POST /api/songs → Crear canción nueva
router.post('/', async (req, res) => {
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
      uploadedBy: '6828d16165d027365213f979' // Usuario fijo
    });

    res.status(201).json(newSong);
  } catch (err) {
    console.error('Error creando canción:', err);
    res.status(500).json({ message: 'Error interno al crear canción' });
  }
});

// 📃 GET /api/songs → Listar todas (opcional)
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
