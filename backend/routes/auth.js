// backend/routes/auth.js

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');

const router = express.Router();

// Ruta POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1) buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // 2) comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // 3) generar JWT
    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// (Opcional) Ruta POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hash });
    res.status(201).json({ id: newUser._id });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
