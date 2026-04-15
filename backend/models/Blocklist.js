// ── BLOCKLIST MODEL ──
const mongoose = require('mongoose');

const BlocklistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  blockedAt: { type: Date, default: Date.now },
  reason: { type: String, default: 'Recruiter request rejected' }
}, { timestamps: true });

module.exports = mongoose.model('Blocklist', BlocklistSchema);