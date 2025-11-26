# How to Get Error Details

## 🔍 Current Situation
Registration is failing, but we need to see **the actual error message**.

## 📋 Steps to See the Error

### Step 1: Check Browser Console
1. Open DevTools (Press `F12`)
2. Go to **Console** tab
3. Try to register
4. **Look for error messages** - you should now see:
   - "Registering with data: ..."
   - "Registration error: ..."
   - "Error response: ..."

### Step 2: Check Server Console
**This is the most important!**

1. Look at the terminal/console where your server is running
2. When you try to register, you should see:
   ```
   === REGISTRATION REQUEST ===
   Name: ...
   Email: ...
   ...
   ============================
   ```
3. **Then look for error messages** - they will show what's wrong

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to register
4. Click on the failed `/api/auth/register` request
5. Go to **Response** tab
6. **Copy the error message** - it should show details

## 🎯 What to Look For

### Common Errors:

1. **"Password must contain..."**
   - Password validation failed
   - Check password requirements

2. **"Church with this email already exists"**
   - Email is already registered
   - Use a different email

3. **"Database error"**
   - Database issue
   - Check server console for details

4. **"Failed to register church"**
   - Database insert failed
   - Check server console for SQL error

5. **"Server error"**
   - General server error
   - Check server console for stack trace

## 📤 What I Need From You

**Please share:**
1. ✅ What you see in **browser console** (F12 → Console tab)
2. ✅ What you see in **server console** (the terminal where server runs)
3. ✅ The **Response** tab content from Network request

This will help me fix the exact issue!

---

**The code now has better error logging - check both consoles!** 🔍


