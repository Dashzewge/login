const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token байхгүй' });

  try {
    const decoded = jwt.verify(token, 'secret123'); // нууц үгээ өөрчилж хэрэглээрэй
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Token буруу' });
  }
};
