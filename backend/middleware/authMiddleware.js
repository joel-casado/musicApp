let jwt = require('jsonwebtoken');
let User = require('../models/User');

let auth = async (req, res, next) => {
  let authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se ha dado token' });
  }

  let token = authHeader.split(' ')[1];

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token: usuario no encontrado' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = auth;
