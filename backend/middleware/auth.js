const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'smartevents_secret_key_2026';

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    next();
  };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role_name || 'user' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { authenticate, authorize, generateToken };
