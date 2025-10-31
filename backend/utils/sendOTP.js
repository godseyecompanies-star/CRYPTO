const twilio = require('twilio');

const sendOTP = async (phoneNumber, otp) => {
  try {
    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('Twilio not configured. OTP:', otp);
      return { success: true, message: 'OTP logged to console (Twilio not configured)' };
    }

    // Initialize Twilio client only when credentials are available
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      body: `Your CryptoCoins verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return { success: true, message: 'OTP sent successfully', sid: message.sid };
  } catch (error) {
    console.error('Error sending OTP:', error);
    // In development, log OTP to console
    console.log('OTP for', phoneNumber, ':', otp);
    return { success: false, message: 'Failed to send OTP', error: error.message };
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendOTP, generateOTP };
