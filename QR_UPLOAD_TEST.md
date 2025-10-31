# 🧪 QR Code Upload - Testing Instructions

## ✅ NEW FIXES APPLIED:

### 1️⃣ **Backend - Delete Old File**
When new QR uploaded, old QR file is automatically deleted from server.

### 2️⃣ **Frontend - Force Page Reload**
After successful upload, page automatically refreshes to show new QR.

### 3️⃣ **Cache Busting**
Timestamp added to URL to prevent browser caching.

---

## 🧪 HOW TO TEST:

### Step 1: Prepare Test Images
1. Find 2-3 different QR code images
2. Name them clearly: `qr-test-1.png`, `qr-test-2.png`, etc.
3. Make sure they look visually different

### Step 2: Upload First QR
1. Go to: `http://localhost:3000/admin/settings`
2. Scroll to "Payment QR Code" section
3. Click "Click to upload"
4. Select `qr-test-1.png`
5. Click "Upload QR Code" button
6. ✅ Success message appears
7. ⏳ Page will automatically reload in 1 second
8. ✅ New QR code should be visible

### Step 3: Verify User Side
1. Open new browser tab
2. Login as regular user (not admin)
3. Go to: `http://localhost:3000/add-money`
4. ✅ Same QR code should be showing

### Step 4: Upload Second QR
1. Go back to admin settings
2. Upload `qr-test-2.png`
3. ⏳ Page reloads automatically
4. ✅ Old QR replaced with new one

### Step 5: Verify Again
1. Go to user Add Money page
2. Refresh page (F5)
3. ✅ New QR code visible

---

## 🔍 WHAT TO CHECK:

### ✅ Success Indicators:
- [ ] Success message: "QR code updated successfully"
- [ ] Page reloads automatically after 1 second
- [ ] New QR image shows in "Current QR Code" section
- [ ] Old QR is completely replaced (not both showing)
- [ ] User Add Money page shows same new QR
- [ ] No error messages in console

### ❌ Failure Indicators:
- [ ] Old QR still showing after upload
- [ ] Error message appears
- [ ] Page doesn't reload
- [ ] Console shows errors
- [ ] User sees different QR than admin

---

## 🐛 IF IT STILL DOESN'T WORK:

### Check Console Logs:
```javascript
// Backend console should show:
Old QR code deleted: uploads/qrCode-xxx.png
New QR code saved: uploads/qrCode-yyy.png
```

### Check uploads/ folder:
```bash
cd backend
dir uploads
```
Should see only ONE qrCode file (the latest one)

### Hard Browser Refresh:
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### Clear Browser Cache:
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

---

## 📁 FILES CHANGED:

### Backend:
✅ `backend/controllers/adminController.js`
- Added file deletion logic
- Logs old/new file paths

### Frontend:
✅ `frontend/src/pages/admin/Settings.js`
- Added automatic page reload after upload
- Cache-busting timestamp

✅ `frontend/src/pages/AddMoney.js`
- Cache-busting timestamp

---

## 🔧 TECHNICAL DETAILS:

### Upload Flow:
```
1. Admin selects file
2. Click Upload button
3. FormData sent to backend
4. Backend finds old QR file path
5. Delete old file (if exists)
6. Save new file with unique name
7. Update database with new path
8. Return success to frontend
9. Frontend shows success message
10. Wait 1 second
11. Page reloads automatically
12. Fetch settings with new timestamp
13. Load fresh QR image
✅ Done!
```

### Why Page Reload Works:
- Clears ALL browser caches
- Re-fetches everything from server
- No cached images
- Fresh state
- Guaranteed to show latest QR

---

## 💡 TIPS:

### For Testing:
1. Use very different looking QR codes
2. Test multiple times
3. Check both admin and user views
4. Try on different browsers
5. Test on mobile too

### For Production:
1. Keep QR images under 1MB
2. Use clear, high-contrast QR codes
3. Test QR scanning before uploading
4. Keep backup of QR images

---

## 🚨 COMMON ISSUES:

### Issue: "File size must be less than 5MB"
**Fix:** Compress image or use smaller file

### Issue: "Only image files are allowed"
**Fix:** Make sure file is PNG, JPG, or GIF

### Issue: Old QR still showing
**Fix:** 
1. Check backend console logs
2. Manually delete uploads/qrCode-* files
3. Upload fresh QR
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: QR not showing at all
**Fix:**
1. Check if uploads/ folder exists
2. Check file permissions
3. Check backend error logs

---

## ✅ SUCCESS CRITERIA:

Your QR upload is working correctly if:

1. ✅ Upload shows success message
2. ✅ Page reloads automatically
3. ✅ New QR replaces old QR completely
4. ✅ Admin and users see same QR
5. ✅ Only one QR file in uploads folder
6. ✅ Works every time you upload
7. ✅ No error messages
8. ✅ No browser refresh needed

---

## 📞 FINAL TEST:

Do this complete flow:

```
1. Upload QR #1
   ✅ Shows in admin
   ✅ Shows in user Add Money

2. Upload QR #2
   ✅ QR #1 disappears
   ✅ QR #2 shows in admin
   ✅ QR #2 shows in user Add Money

3. Upload QR #3
   ✅ QR #2 disappears
   ✅ QR #3 shows everywhere

4. Check uploads folder
   ✅ Only QR #3 file exists
   ✅ Old files are gone
```

If all these work, your QR system is perfect! 🎉

---

Last Updated: January 27, 2025
Status: ✅ READY TO TEST
