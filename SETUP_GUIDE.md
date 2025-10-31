# CryptoCoins - Complete Setup Guide

This guide will help you set up and run the CryptoCoins platform on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional, for cloning) - [Download](https://git-scm.com/downloads)

## 🚀 Step-by-Step Setup

### Step 1: Install MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string

### Step 2: Backend Setup

1. Open terminal and navigate to backend folder:
   ```bash
   cd C:\Users\GODSEYE GROUP\Desktop\CRYPTOCOINS\backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   copy .env.example .env
   ```

4. Edit `.env` file and update:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/cryptocoins
   
   # OR for MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptocoins
   
   JWT_SECRET=your_random_secret_key_here_change_this
   JWT_EXPIRE=7d
   
   # Twilio (Optional - OTP will log to console if not configured)
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   
   CLIENT_URL=http://localhost:3000
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

5. Seed the database with sample data:
   ```bash
   node utils/seedDatabase.js
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running in development mode on port 5000
   MongoDB Connected: localhost
   ```

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend folder:
   ```bash
   cd C:\Users\GODSEYE GROUP\Desktop\CRYPTOCOINS\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   
   The app will automatically open in your browser at `http://localhost:3000`

## 🎯 First Time Usage

### Login as Admin

After seeding the database, you can login as admin:
- **Phone Number:** +919999999999
- **Password:** Admin@123

### Create Test User

1. Click "Register" on the login page
2. Fill in the form:
   - Full Name: Test User
   - Phone: +911234567890 (or any phone number)
   - Password: Test@123
3. Login with the new credentials

### Add Sample Coins (If not already seeded)

1. Login as admin
2. Go to "Coin Management"
3. Add coins like:
   - Bitcoin (BTC) - Price: 3500000, Weekly Profit: 8.5%
   - Ethereum (ETH) - Price: 250000, Weekly Profit: 7.8%
   - Solana (SOL) - Price: 12000, Weekly Profit: 9.2%

### Upload Payment QR Code

1. Login as admin
2. Go to "Settings"
3. Upload your PayTM/UPI QR code image
4. Users will see this QR code when adding money

## 💡 Testing the Platform

### As User:

1. **Add Money:**
   - Go to "Add Money"
   - Enter amount (e.g., 10000)
   - Upload a screenshot (any image for testing)
   - Submit request

2. **Approve Deposit (as Admin):**
   - Login as admin (in a different browser or incognito)
   - Go to "Transaction Management"
   - Find the pending deposit
   - Click "View Details" and approve it

3. **Invest in Coins:**
   - Back to user account
   - Go to "Coins"
   - Click "Invest Now" on any coin
   - Enter amount (e.g., 5000)
   - Confirm investment

4. **View Investments:**
   - Go to "Investments" to see your portfolio
   - Check current value and profits

### As Admin:

1. **User Management:**
   - View all registered users
   - Add/deduct money from any user's wallet
   - Activate/deactivate users

2. **Coin Management:**
   - Add new coins
   - Update prices and profit percentages
   - Activate/deactivate coins

3. **Transaction Management:**
   - Review all deposits and withdrawals
   - Approve or reject with notes

4. **Analytics:**
   - View coin purchase statistics
   - Track user growth
   - Monitor platform revenue

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:** 
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check your MONGODB_URI in .env file

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in backend/.env to different port (e.g., 5001)
- Update frontend proxy in frontend/package.json

### React Not Starting
```
Error: Cannot find module 'react'
```
**Solution:**
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### File Upload Not Working
**Solution:**
- Ensure `uploads` folder exists in backend directory
- Check MAX_FILE_SIZE in .env (default 5MB)

## 📱 Testing OTP Feature

If Twilio is not configured:
- OTP will be logged to backend console
- Check terminal running backend for OTP codes
- Use logged OTP for password reset

To configure Twilio:
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID, Auth Token, and Phone Number
3. Update .env file with credentials

## 🌐 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create cryptocoins-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
# ... set all other env variables

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
```

Update API URL in frontend to point to deployed backend.

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter issues:
1. Check this guide carefully
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Ensure all dependencies are installed

## ✅ Quick Start Checklist

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Database seeded (`node utils/seedDatabase.js`)
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (`npm start`)
- [ ] Admin login working (+919999999999 / Admin@123)
- [ ] Can register new users
- [ ] QR code uploaded in admin settings
- [ ] Test deposit and investment flow

---

**You're all set! Happy coding! 🚀**
