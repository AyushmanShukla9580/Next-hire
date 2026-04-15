const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  
  if (!email || !password) {
    console.log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
    return;
  }
  
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      name: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
      company: 'NextHire'
    });
    
    console.log('✅ Default admin user created:', email);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

module.exports = seedAdmin;
