const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    const User = require('../models/User');

    // Find admin user
    const admin = await User.findOne({ phoneNumber: '+919999999999' });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Run: node utils/seedDatabase.js to create admin');
      process.exit(1);
    }

    // Reset password to Admin@123
    const newPassword = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    
    // Ensure account is active
    admin.isActive = true;
    
    await admin.save();

    console.log('\n✅ Admin password reset successfully!');
    console.log('\n📱 Admin Credentials:');
    console.log('   Phone: +919999999999');
    console.log('   Password: Admin@123');
    console.log('\n⚠️  Remember to clear browser cache before logging in!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
