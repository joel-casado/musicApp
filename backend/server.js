// backend/server.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const cors     = require('cors');
const jwt      = require('jsonwebtoken');

const User     = require('./models/User');
const Song     = require('./models/Song');
const Playlist = require('./models/Playlist');
const app      = express();
const path     = require('path');
const songsRoutes = require('./routes/songs');


app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use('/api/songs', songsRoutes);

app.use('/music', express.static(__dirname + '/public/music'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/playlists', require('./routes/playlists'));


app.get('/', (req, res) => res.send('Node.js está funcionando'));

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'El correo ya está en uso.' });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hash, role: 'user' });
    res.status(201).json({ message: 'Usuario creado.', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno de servidor.' });
  }
});

app.get('/test-all', async (req, res) => {
  try {
    const hash = await bcrypt.hash('test123', 10);
    const testUser = await User.create({ username: 'melodytester2', email: 'melody@tests.com', password: hash });
    const testSong = await Song.create({
      title: 'Dreamland Echoess',
      artist: 'Echofox',
      genre: 'Chillwave',
      duration: 230,
      url: 'http://example.com/song.mp3',
      uploadedBy: testUser._id
    });
    const testPlaylist = await Playlist.create({
      title: 'Vibe Zones',
      description: 'Chill tunes to lose your mind to',
      songs: [testSong._id],
      owner: testUser._id,
      isPublic: true
    });
    res.json({ message: 'Test data created', testUser, testSong, testPlaylist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error en la conexión con MongoDB:', err);
    process.exit(1);
  });
