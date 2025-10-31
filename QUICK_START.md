# 🚀 Quick Start Guide - CryptoCoins Platform

Get up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js installed (v14+)
- MongoDB installed or MongoDB Atlas account

## 🎯 Installation Steps

### 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file manually with this content:
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cryptocoins
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

```bash
# Seed database with sample data
node utils/seedDatabase.js

# Start backend
npm run dev
```

✅ Backend running at http://localhost:5000

### 2️⃣ Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

✅ Frontend running at http://localhost:3000

## 🎉 You're Ready!

### 🔑 Login Credentials

**Admin Account:**
- Phone: `+919999999999`
- Password: `Admin@123`

**Or create a new user:**
- Click "Register" and fill the form

## 🎮 Quick Test Flow

### As Admin:
1. Login with admin credentials
2. Go to Settings → Upload a QR code image (any image for testing)
3. Go to Coin Management → Coins are already created!
4. Go to Transaction Management → Wait for user deposits

### As User:
1. Register a new account (any phone number works)
2. Go to Add Money → Enter 10000 → Upload any image → Submit
3. Switch to admin → Approve the deposit
4. Back to user → Go to Coins → Invest 5000 in Bitcoin
5. Check Investments page → See your portfolio!

## 📁 Project Structure

```
CRYPTOCOINS/
├── backend/          (Node.js + Express + MongoDB)
│   ├── server.js     (Start here)
│   └── .env          (Configuration)
└── frontend/         (React + TailwindCSS)
    ├── src/
    │   ├── pages/    (All pages)
    │   └── App.js    (Routes)
    └── package.json
```

## 🔧 Common Issues

**MongoDB not connecting?**
```bash
# Windows: Start MongoDB
net start MongoDB

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env with your Atlas connection string
```

**Port already in use?**
```bash
# Change PORT in backend/.env to 5001
# Also update proxy in frontend/package.json to 5001
```

**Missing dependencies?**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📖 Full Documentation

- See `README.md` for complete feature list
- See `SETUP_GUIDE.md` for detailed setup instructions
- See code comments for technical details

## 🎨 Features

✅ User Authentication (Register/Login/Forgot Password)
✅ Wallet Management (Deposit/Withdraw)
✅ Cryptocurrency Investment System
✅ Admin Dashboard with Full Control
✅ Transaction Management (Approve/Reject)
✅ Analytics & Reports
✅ Responsive Green & White UI
✅ Secure File Uploads
✅ Role-Based Access (User/Admin)

## 🌐 Tech Stack

- **Backend:** Node.js, Express, MongoDB, JWT
- **Frontend:** React, React Router, TailwindCSS, Axios
- **Styling:** TailwindCSS with custom green theme
- **Icons:** Lucide React

## 💡 Tips

1. **OTP Feature:** Without Twilio, OTP will print in backend console
2. **File Uploads:** Images stored in `backend/uploads/`
3. **Database:** Check MongoDB Compass to view data
4. **Admin Panel:** Access via `/admin/dashboard` route

## 🚀 Next Steps

1. Customize coin prices and profit percentages
2. Upload your real PayTM QR code
3. Configure Twilio for SMS OTP
4. Deploy to production (Heroku + Vercel)
5. Add more features as needed

---

**Need Help?** Check `SETUP_GUIDE.md` for troubleshooting!

**Ready to deploy?** See deployment section in `README.md`!
