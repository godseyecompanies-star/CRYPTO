// Quick script to reset QR code path in database
require('dotenv').config();
const connectDB = require('./config/db');

const resetQR = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected');
    
    // Get Settings model
    const Settings = require('./models/Settings');
    
    // Update qrCodeImage to empty string
    const result = await Settings.updateMany(
      {},
      { $set: { qrCodeImage: '' } }
    );
    
    console.log('✅ QR code path cleared in database');
    console.log('Documents updated:', result.modifiedCount);
    
    // Verify
    const settings = await Settings.findOne();
    console.log('Current qrCodeImage:', settings?.qrCodeImage || '(empty)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetQR();
