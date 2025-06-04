const express = require('express');
const router = express.Router();

// Жишээ маршрут
router.get('/', (req, res) => {
  res.json({ message: "Accountant API ажиллаж байна!" });
});

module.exports = router;
