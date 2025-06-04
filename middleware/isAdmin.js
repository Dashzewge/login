// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // admin бол үргэлжлүүл
  } else {
    res.status(403).json({ error: 'Зөвхөн admin эрхтэй хэрэглэгч энэ үйлдлийг хийж чадна.' });
  }
};

module.exports = isAdmin;
