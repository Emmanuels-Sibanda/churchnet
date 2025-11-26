# How to Check Server Errors

## 🔍 The Issue
You're getting 500 errors, but we need to see **what the server is actually saying**.

## 📋 Steps to Find the Error

### Step 1: Check Your Server Console
**This is the most important step!**

1. Look at the terminal/console where your server is running
2. When you try to register, you should see:
   ```
   Registration request received: { name: '...', email: '...', ... }
   ```
3. **Then look for error messages** - they will show what's wrong

### Step 2: If You Don't See Any Logs
If you don't see "Registration request received", it means:
- ❌ The server might not be running
- ❌ The request isn't reaching the server
- ❌ There's an error before the log statement

### Step 3: Check Browser Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to register
4. Click on the failed `/api/auth/register` request
5. Go to **Response** tab
6. **Copy the error message** - it should show details

### Step 4: Common Errors to Look For

#### "Database not initialized"
- **Fix:** Make sure the server started properly
- **Check:** Look for "Connected to SQLite database" in server console

#### "JWT_SECRET not set"
- **Fix:** Already set, but server might not have loaded it
- **Check:** Restart server

#### "Database error" with SQL error
- **Fix:** Database schema issue
- **Check:** Look at the full error message

#### "Cannot read property 'lastID' of undefined"
- **Fix:** The dbRun promise isn't returning correctly
- **Check:** This is a code issue I need to fix

## 🎯 What I Need From You

**Please share:**
1. ✅ What you see in your **server console** when you try to register
2. ✅ The **Response** tab content from the Network request
3. ✅ Any error messages that appear

This will help me fix the exact issue!

---

**The code is fixed, but I need to see the actual error to know what's happening.**

