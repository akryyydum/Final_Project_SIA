module.exports = function requireAdmin(req, res, next) {
  // If using JWT, you should decode the token and attach user info to req.user
  // For now, let's assume req.user is already set by previous auth middleware
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admins only' });
};