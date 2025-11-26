# Registration 500 Error - Debug Steps

## 🔍 Current Situation
You're getting a 500 error, but we need to see **what the server is actually saying**.

## ⚠️ CRITICAL: Check Your Server Console

**The most important thing:** Look at the terminal/console where your server is running.

### What to Look For:

1. **When you try to register, you should see:**
   ```
   Registration request received: { name: '...', email: '...', ... }
   ```

2. **Then you'll see one of these:**

   **If it's working:**
   - No error messages
   - Registration succeeds

   **If there's an error:**
   ```
   === DATABASE OPERATION ERROR ===
   Error type: ...
   Error message: ...
   Error code: ...
   Error stack: ...
   ================================
   ```
   
   OR
   
   ```
   === REGISTRATION ERROR (OUTER CATCH) ===
   Error type: ...
   Error message: ...
   Error stack: ...
   ========================================
   ```

## 📋 Step-by-Step Debugging

### Step 1: Make Sure Server is Running
1. Check if you have a terminal/console window with the server running
2. You should see: `Server running on port 5000`
3. If not, start it:
   ```bash
   cd server
   npm start
   ```

### Step 2: Restart the Server
**IMPORTANT:** If you haven't restarted since the code changes, do it now:

1. Stop server: Press `Ctrl + C` in the server terminal
2. Start server: `npm start`
3. Wait for: `Server running on port 5000`

### Step 3: Try Registration
1. Go to your browser
2. Try to register
3. **IMMEDIATELY look at your server console**

### Step 4: Share the Error
**Copy and paste what you see in the server console** - especially:
- The "Registration request received" line
- Any error messages with `===` markers
- The full error stack trace

## 🔧 Quick Test

Run this to test the endpoint directly:

```bash
cd server
node test-registration-live.js
```

This will show you the exact error from the server.

## 🎯 Common Issues

### Issue 1: Server Not Restarted
- **Symptom:** Same error keeps happening
- **Fix:** Restart the server (Ctrl+C, then npm start)

### Issue 2: Database Not Initialized
- **Symptom:** "Database not initialized" error
- **Fix:** Make sure server started properly, check for "Connected to SQLite database"

### Issue 3: JWT_SECRET Missing
- **Symptom:** "JWT_SECRET not set" error
- **Fix:** Already set, but restart server to reload .env

### Issue 4: Promise Error
- **Symptom:** Error about "lastID" or Promise rejection
- **Fix:** This is a code issue I can fix once I see the error

---

**The key is: Check your server console and share what you see!** 📺


