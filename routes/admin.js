const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Шинэ хэрэглэгч бүртгэх (зөвхөн admin)
router.post('/register', auth, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed, role });

  await newUser.save();
  res.json({ message: 'Хэрэглэгч бүртгэгдлээ' });
});

module.exports = router;
