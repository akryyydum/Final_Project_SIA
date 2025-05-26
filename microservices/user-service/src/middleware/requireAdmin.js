const jwt = require('jsonwebtoken');

module.exports = function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // <-- Add this line
    if (decoded && decoded.role === 'admin') {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ message: 'Admins only' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};