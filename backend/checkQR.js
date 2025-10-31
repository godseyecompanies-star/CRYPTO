const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const checkQRCode = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Import Settings model
    const Settings = require('./models/Settings');

    // Check database
    console.log('📋 CHECKING DATABASE:');
    console.log('─'.repeat(50));
    const settings = await Settings.findOne();
    
    if (!settings) {
      console.log('❌ No settings document found in database!');
      console.log('Creating new settings document...');
      await Settings.create({});
      console.log('✅ Created new settings document');
    } else {
      console.log('Settings Document:');
      console.log(JSON.stringify(settings, null, 2));
      console.log('\nQR Code Path:', settings.qrCodeImage || '(empty)');
    }

    // Check file system
    console.log('\n📁 CHECKING FILE SYSTEM:');
    console.log('─'.repeat(50));
    const uploadsDir = path.join(__dirname, 'uploads');
    const qrFilePath = path.join(uploadsDir, 'payment-qr-code.png');

    console.log('Uploads directory:', uploadsDir);
    console.log('Expected QR file:', qrFilePath);

    if (fs.existsSync(uploadsDir)) {
      console.log('✅ Uploads directory exists');
      
      const files = fs.readdirSync(uploadsDir);
      console.log(`\nFiles in uploads directory (${files.length}):`);
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      });

      if (fs.existsSync(qrFilePath)) {
        const stats = fs.statSync(qrFilePath);
        console.log(`\n✅ payment-qr-code.png EXISTS!`);
        console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`   Modified: ${stats.mtime}`);
      } else {
        console.log('\n❌ payment-qr-code.png NOT FOUND!');
      }
    } else {
      console.log('❌ Uploads directory does not exist!');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY:');
    console.log('='.repeat(50));
    
    const dbHasPath = settings && settings.qrCodeImage;
    const fileExists = fs.existsSync(qrFilePath);
    
    if (dbHasPath && fileExists) {
      console.log('✅ Status: GOOD - Database has path AND file exists');
    } else if (!dbHasPath && !fileExists) {
      console.log('⚠️ Status: NO QR CODE - Database empty AND no file');
      console.log('   Action: Upload a QR code from admin panel');
    } else if (dbHasPath && !fileExists) {
      console.log('❌ Status: MISMATCH - Database has path but FILE MISSING');
      console.log('   Action: Re-upload QR code');
    } else if (!dbHasPath && fileExists) {
      console.log('❌ Status: MISMATCH - File exists but DATABASE EMPTY');
      console.log('   Action: Run this fix:');
      console.log('   await Settings.updateOne({}, { qrCodeImage: "uploads/payment-qr-code.png" })');
    }

    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkQRCode();
