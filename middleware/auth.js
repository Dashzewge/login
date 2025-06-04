const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token байхгүй байна' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret123'); // secret123-г тохируул
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token хүчингүй байна' });
  }
};

module.exports = auth;
