const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta si es distinta

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate que esté definido en .env

    const user = await User.findById(decoded.sub); // usamos "sub" como subject (lo usaste tú)

    if (!user) {
      return res.status(401).json({ error: 'Invalid token: user not found' });
    }

    req.user = user; // lo inyectamos en la request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = auth;
