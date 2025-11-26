# Fix Registration 500 Error - Step by Step

## ✅ JWT_SECRET Status
Your JWT_SECRET is already set in `server/.env` file.

## 🔧 The Real Issue
The 500 error is likely caused by the async callback issue I just fixed. **You need to restart your server** for the fix to take effect.

## 📋 Step-by-Step Fix

### Step 1: Stop Your Server
1. Go to the terminal/console where your server is running
2. Press `Ctrl+C` to stop it
3. Wait for it to fully stop

### Step 2: Restart Your Server
```bash
cd server
npm start
```

You should see:
```
Connected to SQLite database
WAL mode enabled for better concurrency
Busy timeout set to 5000ms
Server running on port 5000
```

### Step 3: Try Registration Again
1. Go to your browser
2. Try to register a new user
3. Check if it works now

### Step 4: Check Server Console
If it still fails, **look at your server console** - you should see:
- "Registration request received: { name, email, ... }"
- Then either success or a detailed error

## 🔍 If Still Not Working

### Check Browser Network Tab:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try registering
4. Click on the failed request
5. Go to **Response** tab
6. Copy the error message and share it

### Common Issues After Restart:

1. **"Database not initialized"**
   - Wait a few seconds after server starts
   - Try again

2. **"JWT_SECRET not set"**
   - Your .env file has it, but server might not be loading it
   - Make sure you're running from `server/` directory
   - Check `.env` file is in `server/` folder

3. **"Database error"**
   - Database file might be locked
   - Close any other programs using the database
   - Restart server

## ✅ What I Fixed

1. ✅ Fixed async callback issue in registration route
2. ✅ Improved error handling
3. ✅ Better error logging
4. ✅ Email errors won't break registration

## 🎯 Most Important Step

**RESTART YOUR SERVER!** The code changes won't work until you restart.

---

**After restarting, try registration again and let me know what happens!**

