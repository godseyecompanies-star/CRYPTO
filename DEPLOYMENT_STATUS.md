# 🔍 Troubleshooting Login Issues

## Current Status

Your app is deployed but login is failing. Here's what to check:

## ✅ Step 1: Verify Backend Environment Variables on Render

Go to your Render backend: https://dashboard.render.com/web/srv-d492ga4f0nms8hcs0tg/env

**Required Environment Variables:**
```
CLIENT_URL = https://cryptocoins-investment.netlify.app
NODE_ENV = production
MONGODB_URI = mongodb+srv://cryptocoins:admin123@cluster0.j9z0wij.mongodb.net/?appName=Cluster0
JWT_SECRET = cryptocoins_super_secret_key_change_in_production_12345
JWT_EXPIRE = 7d
MAX_FILE_SIZE = 5242880
UPLOAD_PATH = ./uploads
```

**CRITICAL:** Make sure `CLIENT_URL` is EXACTLY:
```
https://cryptocoins-investment.netlify.app
```
(No trailing slash, must start with https://)

---

## ✅ Step 2: Manual Redeploy Backend

1. Go to: https://dashboard.render.com
2. Click on "CRYPTOCOINS" service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-3 minutes

---

## ✅ Step 3: Check CORS in Browser Console

On your phone or computer:
1. Open: https://cryptocoins-investment.netlify.app/login
2. Open browser DevTools (F12)
3. Go to "Console" tab
4. Try to login
5. Look for errors containing "CORS" or "blocked"

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Error
**Error:** "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Fix:**
- Update `CLIENT_URL` on Render to: `https://cryptocoins-investment.netlify.app`
- Redeploy backend

### Issue 2: Network Error / Timeout
**Error:** "Network Error" or request timeout

**Fix:**
- Backend is still waking up (wait 60 seconds)
- Check if backend is live: https://cryptocoins-hg2t.onrender.com/api/coins

### Issue 3: 401 Unauthorized
**Error:** "Unauthorized" or "Invalid credentials"

**Fix:**
- User doesn't exist - register first
- Password incorrect

### Issue 4: Backend Not Responding
**Symptom:** Login button just spins forever

**Fix:**
- Visit backend directly: https://cryptocoins-hg2t.onrender.com
- Should see "Cannot GET /" (means it's running)
- If you see "Application error", backend crashed - check logs

---

## 🧪 Test Backend Directly

Open this URL in browser:
```
https://cryptocoins-hg2t.onrender.com/api/coins
```

**Expected:** Empty array `[]` or list of coins
**If you see:** "Application error" or nothing → Backend issue

---

## 📞 Debug Checklist

- [ ] CLIENT_URL set correctly on Render
- [ ] Backend redeployed after CORS fix
- [ ] Frontend using correct API URL
- [ ] Backend responds to: /api/coins
- [ ] No CORS errors in browser console
- [ ] User account exists (try registering first)

---

## 🚀 Quick Fix Steps

1. **Update CLIENT_URL on Render:**
   - https://dashboard.render.com/web/srv-d492ga4f0nms8hcs0tg/env
   - Set: `CLIENT_URL = https://cryptocoins-investment.netlify.app`

2. **Redeploy Backend:**
   - Click "Manual Deploy" → "Deploy latest commit"

3. **Wait 2 minutes**, then test login again

4. **If still failing:** Share screenshot of browser console errors
