// ── AUTH ROUTES ──
const express = require('express');
const User = require('../models/User');
const Blocklist = require('../models/Blocklist');
const bcrypt = require('bcryptjs');
const { genToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    
    // Check if email is blocked
    const blocked = await Blocklist.findOne({ email: email.toLowerCase() });
    if (blocked) return res.status(400).json({ message: 'This email is not allowed. Contact admin for more info.' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    let userData = { name, email, password: hashedPassword, company };
    
    if (role === 'recruiter') {
      userData.role = 'recruiter';
      userData.recruiterRequestStatus = 'pending';
      userData.isApprovedRecruiter = false;
      
      // Create user but don't return token - require admin approval
      const user = await User.create(userData);
      return res.status(201).json({ 
        message: 'Your recruiter account is pending approval. Please wait for admin to approve.',
        pending: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, recruiterRequestStatus: 'pending' }
      });
    } else if (role === 'admin') {
      userData.role = 'admin';
      const user = await User.create(userData);
      res.status(201).json({ token: genToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
    } else {
      userData.role = 'candidate';
      const user = await User.create(userData);
      res.status(201).json({ token: genToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
    }
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
    
    console.log('Login attempt - Role:', user.role, 'Status:', user.recruiterRequestStatus, 'Approved:', user.isApprovedRecruiter);
    
    // Block recruiters who are pending approval
    if (user.role === 'recruiter' && user.recruiterRequestStatus === 'pending' && !user.isApprovedRecruiter) {
      console.log('Blocking pending recruiter login');
      return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin to approve.' });
    }
    
    res.json({ token: genToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, isApprovedRecruiter: user.isApprovedRecruiter, recruiterRequestStatus: user.recruiterRequestStatus } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;