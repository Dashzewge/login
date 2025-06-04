const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // ✔️ required, unique
  password: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
