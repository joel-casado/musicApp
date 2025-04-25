const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Root test route
app.get('/', (req, res) => {
    res.send('MelodyNest API is running 🎵');
});

// 👇 This route creates and fetches a test user, song, and playlist
app.get('/test-all', async (req, res) => {
    try {
        // Create test user
        const testUser = new User({
            username: 'melodytester',
            email: 'melody@test.com',
            password: 'hashedpassword123' // just a placeholder for now
        });
        await testUser.save();

        // Create test song
        const testSong = new Song({
            title: 'Dreamland Echoes',
            artist: 'Echofox',
            genre: 'Chillwave',
            duration: 230,
            url: 'http://example.com/song.mp3',
            uploadedBy: testUser._id
        });
        await testSong.save();

        // Create test playlist
        const testPlaylist = new Playlist({
            title: 'Vibe Zone',
            description: 'Chill tunes to lose your mind to',
            songs: [testSong._id],
            owner: testUser._id,
            isPublic: true
        });
        await testPlaylist.save();

        res.json({
            message: "✅ Test data created",
            user: testUser,
            song: testSong,
            playlist: testPlaylist
        });

    } catch (err) {
        console.error("❌ Error in /test-all:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
