const express = require('express');
const multer = require('multer');
const path = require('path');
const { Application, Interview } = require('../models/index');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${req.user._id}-resume-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, fileFilter: (_, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'));
}});

// Get own profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const [applied, shortlisted, interviews] = await Promise.all([
      Application.countDocuments({ candidate: req.user._id }),
      Application.countDocuments({ candidate: req.user._id, status: 'shortlisted' }),
      Interview.countDocuments({ candidate: req.user._id }),
    ]);
    res.json({ profile: user, stats: { applied, shortlisted, interviews } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { title, bio, skills, experience, education, linkedin, github } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { title, bio, skills, experience, education, linkedin, github }, { new: true }).select('-password');
    res.json({ profile: user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Upload resume
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { resume: resumeUrl });
    res.json({ resume: resumeUrl });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Candidate stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const [applied, shortlisted, interviews] = await Promise.all([
      Application.countDocuments({ candidate: req.user._id }),
      Application.countDocuments({ candidate: req.user._id, status: 'shortlisted' }),
      Interview.countDocuments({ candidate: req.user._id }),
    ]);
    res.json({ applied, shortlisted, interviews, saved: user.savedJobs?.length || 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// My applications
router.get('/applications', protect, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title location company type salary')
      .sort('-createdAt');
    res.json({ applications });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Saved jobs
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ jobs: user.savedJobs || [] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;