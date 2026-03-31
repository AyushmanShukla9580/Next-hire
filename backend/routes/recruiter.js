const express = require('express');
const { Job, Application, Interview } = require('../models/index');
const { protect, recruiterOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, recruiterOnly, async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = myJobs.map(j => j._id);
    const [totalApplicants, shortlisted, interviews] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' }),
      Interview.countDocuments({ recruiter: req.user._id }),
    ]);
    res.json({ totalJobs: myJobs.length, totalApplicants, shortlisted, interviews });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/analytics', protect, recruiterOnly, async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = myJobs.map(j => j._id);
    const applications = await Application.countDocuments({ job: { $in: jobIds } });
    const selected = await Application.countDocuments({ job: { $in: jobIds }, status: 'selected' });
    const views = myJobs.reduce((sum, j) => sum + (j.views || 0), 0);

    // Top jobs by applicant count
    const topJobs = await Promise.all(myJobs.map(async j => ({
      title: j.title,
      count: await Application.countDocuments({ job: j._id }),
    })));
    topJobs.sort((a, b) => b.count - a.count);

    res.json({
      views, applications,
      conversion: applications ? Math.round((selected / applications) * 100) : 0,
      avgHire: 14,
      topJobs: topJobs.slice(0, 5),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;