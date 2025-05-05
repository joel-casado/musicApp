const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();


// Import de los modelos a medida q se crean
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

// Inicializacion de express y cors
const app = express();
app.use(cors({
    origin: 'http://localhost:4200', // Frontend dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If you're dealing with cookies/auth
  }));
app.use(express.json());

// Conexion a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error en la conexión con Mongo:", err));

// Root test route
app.get('/', (req, res) => {
    res.send('Node.js está funcionando');	
});

//Crear Usuario
app.post('/api/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Se han de llenar todos los campos.' });
        }

        // Check if email or username already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'El correo ya está en uso.' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Hasheando la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado con éxito.', user: newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: 'Error interno de servidor.' });
    }
});

// 👇 This route creates and fetches a test user, song, and playlist
app.get('/test-all', async (req, res) => {
    try {
        // Create test user
        const testUser = new User({
            username: 'melodytester2',
            email: 'melody@tests.com',
            password: 'hashedpassword123' // just a placeholder for now
        });
        await testUser.save();

        // Create test song
        const testSong = new Song({
            title: 'Dreamland Echoess',
            artist: 'Echofox',
            genre: 'Chillwave',
            duration: 230,
            url: 'http://example.com/song.mp3',
            uploadedBy: testUser._id
        });
        await testSong.save();

        // Create test playlist
        const testPlaylist = new Playlist({
            title: 'Vibe Zones',
            description: 'Chill tunes to lose your mind to',
            songs: [testSong._id],
            owner: testUser._id,
            isPublic: true
        });
        await testPlaylist.save();

        res.json({
            message: "Test data created",
            user: testUser,
            song: testSong,
            playlist: testPlaylist
        });

    } catch (err) {
        console.error("Error in /test-all:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
