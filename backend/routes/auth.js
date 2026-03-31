// ── AUTH ROUTES ──
const express = require('express');
const User = require('../models/User');
const { genToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role, company });
    res.status(201).json({ token: genToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;