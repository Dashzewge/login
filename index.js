const express = require('express');


const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const accountantRoutes = require('./routes/accountant'); 
const userRoutes = require('./routes/user'); // path зөв эсэхийг шалгаарай\
const User = require('./models/user');
const auth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');


const app = express();



 

app.use('/api/auth/user', userRoutes);
app.use('/api/accountant', accountantRoutes);


app.use(cors({
  origin: 'http://localhost:3001',  // React frontend-н хаяг
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

// GET /api/user?role=accountant
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    let user;

    if (role) {
      // Том жижиг үсэг үл харгалзан хайлт хийнэ
      user = await User.find({ role: new RegExp(`^${role}$`, 'i') });
    } else {
      user = await User.find();
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});
module.exports = router;

app.use(express.json());
//app.use('/api/accountant', accountantRoutes);
// ===== 1. Role hierarchy =====
const roles = ['user', 'accountant', 'admin'];

/*===== 2. User Schema & Model =====
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});*/




// ===== 3. Token шалгах Middleware =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret123", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ===== 4. Role хяналт хийх Middleware =====
function canCreateUser(req, res, next) {
  const { role } = req.body;
  const requesterRole = req.user.role;

  const requesterIndex = roles.indexOf(requesterRole);
  const newUserIndex = roles.indexOf(role);

  if (newUserIndex >= requesterIndex) {
    return res.status(403).json({ message: "Та өөрөөсөө өндөр эсвэл ижил түвшний хэрэглэгч үүсгэх боломжгүй." });
  }

  next();
}

// ===== 5. Маршрутууд =====

app.get('/', (req, res) => {
  res.send(' Backend ажиллаж байна!');
});

// Бүртгэл
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email бүртгэлтэй байна' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email, //  username-г email болгон хадгалж байна
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(200).json({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ' });
  } catch (err) {
    console.error("Серверийн алдаа:", err);
    res.status(500).json({ message: 'Дотоод серверийн алдаа' });
  }
});



// Нэвтрэх
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Хэрэглэгч олдсонгүй!" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });

  const token = jwt.sign({ userId: user._id, role: user.role }, "secret123", { expiresIn: '1h' });
  res.json({ message: "Нэвтэрлээ!", token });
});

// Хэрэглэгч үүсгэх 
app.post('/api/create-user', authenticateToken, canCreateUser, async (req, res) => {
  const { email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Ийм email бүртгэлтэй байна!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role });
  await user.save();

  res.status(201).json({ message: `${role} хэрэглэгч амжилттай үүслээ!` });
});

// ===== 6. MongoDB холбох =====
mongoose.connect('mongodb://localhost:27017/login-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB холбогдлоо"))
  .catch(err => console.error(" MongoDB холбогдсонгүй", err));

// ===== 7. Сервер =====
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Сервер http://localhost:${PORT} дээр ажиллаж байна`);
});