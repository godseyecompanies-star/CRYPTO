# 🚀 Deployment Guide - CryptoCoins Platform

## Overview
This guide will help you deploy your MERN stack application to production.

**Deployment Strategy:**
- ✅ Frontend (React) → Netlify
- ✅ Backend (Node.js/Express) → Render.com
- ✅ Database → MongoDB Atlas (already configured)

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

#### Backend (.env)
Ensure your backend has these variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
TWILIO_AUTH_TOKEN=your_twilio_token (optional)
TWILIO_PHONE_NUMBER=your_twilio_phone (optional)
CLIENT_URL=https://your-frontend-url.netlify.app
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Frontend (.env)
Your frontend should ONLY have the backend API URL:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

**⚠️ IMPORTANT:** Never expose JWT_SECRET, TWILIO tokens, or MongoDB URI in frontend .env

---

## 🎯 Backend Deployment (Render.com)

### Option 1: Via Render Dashboard

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Service**
   ```
   Name: cryptocoins-backend
   Environment: Node
   Region: Choose nearest
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Add all variables from your .env file
   - Set CLIENT_URL to your Netlify frontend URL

5. **Deploy**
   - Click "Create Web Service"
   - Copy your backend URL (e.g., https://cryptocoins-backend.onrender.com)

### Option 2: Alternative Platforms
- **Railway.app** - Easy deployment with GitHub integration
- **Heroku** - Classic PaaS (requires credit card)
- **DigitalOcean App Platform** - More control and customization

---

## 🎨 Frontend Deployment (Netlify)

### Option 1: Via Windsurf (Automated)
I can deploy your frontend automatically using the deployment tool.

### Option 2: Via Netlify Dashboard

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Drag and drop the `build` folder
   - OR connect GitHub repository

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

4. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = your Render backend URL

5. **Deploy**
   - Netlify will auto-deploy on every push to main branch

---

## 🔗 Post-Deployment Configuration

### 1. Update Backend CLIENT_URL
After frontend deployment, update backend environment variable:
```env
CLIENT_URL=https://your-app-name.netlify.app
```

### 2. Update Frontend API URL
Create/update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://cryptocoins-backend.onrender.com/api
```

### 3. Test CORS
Ensure backend allows your frontend domain in CORS settings.

### 4. File Uploads
**Important:** On Render free tier, uploaded files are ephemeral. Consider:
- **Cloudinary** - Image hosting service
- **AWS S3** - File storage
- **Render Persistent Disks** - Paid feature

---

## 🔐 Security Checklist

- ✅ All secrets in backend .env only
- ✅ Frontend .env has only public API URLs
- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB database has password protection
- ✅ CORS configured correctly
- ✅ HTTPS enabled (automatic on Netlify/Render)
- ✅ Rate limiting enabled in production

---

## 📊 Monitoring & Maintenance

### Health Checks
- Backend health endpoint: `GET /api/health`
- Frontend homepage: `https://your-app.netlify.app`

### Free Tier Limitations

**Render.com (Free)**
- Apps spin down after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- 750 hours/month compute time
- Ephemeral file system

**Netlify (Free)**
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic SSL
- Continuous deployment

### Upgrade Considerations
When you're ready to upgrade:
- **Render Starter Plan:** $7/month - No spin down
- **MongoDB Atlas Shared:** $9/month - Dedicated cluster
- **Cloudinary Free:** Up to 25GB storage

---

## 🐛 Troubleshooting

### Common Issues

**1. Backend not connecting to MongoDB**
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0 for all IPs)
- Verify MONGODB_URI format

**2. CORS errors**
- Update CLIENT_URL in backend .env
- Check CORS middleware configuration

**3. Frontend can't reach backend**
- Verify REACT_APP_API_URL in frontend .env
- Check if backend is running (visit backend URL)

**4. File uploads not working**
- Switch to Cloudinary for persistent storage
- Or upgrade to Render paid plan with persistent disk

**5. Slow first load**
- Expected on Render free tier (cold start)
- Consider paid plan or use a cron job to keep alive

---

## 🎉 Ready to Deploy!

Would you like me to:
1. ✅ Deploy the frontend to Netlify now (automated)
2. 📝 Guide you through backend deployment on Render
3. 🔍 Review your environment variables for security

Let me know how you'd like to proceed!
