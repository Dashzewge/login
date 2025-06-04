const express = require('express');
const router = express.Router();
const User = require("../models/user");



router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Хэрэглэгчийг хайж олох
  const user = users.find(u => u.email === email && u.password === password);
 
  if (!user) {
    return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу байна' });
  }

  if (user.role === 'admin') {
    return res.json({ message: 'Админ амжилттай нэвтэрлээ', role: 'admin' });
  } else {
    return res.json({ message: 'Хэрэглэгч амжилттай нэвтэрлээ', role: 'user' });
  }
});

module.exports = router;

// GET /api/auth/user?role=accountant
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    const users = role
      ? await User.find({ role: new RegExp(`^${role}$`, 'i') })
      : await User.find();

    res.json(users);
  } catch (error) {
    console.error("Алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;      