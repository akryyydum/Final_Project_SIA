const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // <-- This is correct
    if (decoded && decoded.role === 'admin') {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ message: 'Admins only' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireAdmin };
