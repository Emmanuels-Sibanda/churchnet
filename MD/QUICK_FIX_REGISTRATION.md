# Quick Fix for Registration 500 Error

## The Problem
The registration route has an async callback issue that's causing 500 errors.

## What I Fixed
1. ✅ Removed `async` from database callback (causing issues)
2. ✅ Wrapped password hashing in IIFE (Immediately Invoked Function Expression)
3. ✅ Better error logging with error codes
4. ✅ Improved email error handling

## Next Steps

### 1. Restart Your Server
**IMPORTANT:** You must restart your server for changes to take effect!

```bash
# Stop the server (Ctrl+C in the terminal where it's running)
# Then restart:
cd server
npm start
```

### 2. Try Registration Again
After restarting, try registering a new user.

### 3. Check Server Console
You should now see:
- "Registration request received: { ... }"
- Either success or a detailed error message

## If Still Not Working

### Check Browser Network Tab:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try registering
4. Click on `/api/auth/register` request
5. Check **Response** tab - it should show the error details

### Common Issues:

1. **Server not restarted** - Most common! Restart it.
2. **JWT_SECRET missing** - Check `server/.env` has `JWT_SECRET=...`
3. **Database locked** - Close other database connections
4. **Email service error** - Now caught, won't break registration

## The Fix Applied

Changed from:
```javascript
database.get('...', [email], async (err, church) => {
  // async callback - causes issues
```

To:
```javascript
database.get('...', [email], (err, church) => {
  // regular callback
  (async () => {
    // async work inside IIFE
  })();
```

This fixes the async callback issue that was causing the 500 error.

---

**Restart your server and try again!**

