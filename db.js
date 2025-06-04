const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/loginDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB-тай амжилттай холбогдлоо!");
  } catch (error) {
    console.error(" MongoDB холбогдоход алдаа гарлаа:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
