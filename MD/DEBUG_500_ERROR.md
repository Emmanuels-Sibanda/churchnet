# Debugging 500 Error on Registration

## Current Status
Getting 500 Internal Server Error when trying to register.

## What I've Fixed
1. ✅ Removed `privacyAccepted` from destructuring (it's a state variable, not in formData)
2. ✅ Added better error handling for database connection
3. ✅ Added request logging
4. ✅ Wrapped email sending in try-catch (won't break registration)

## Next Steps to Debug

### 1. Check Server Console
**Look at your server terminal/console** - you should see:
- "Registration request received: { name, email, ... }"
- If there's an error, it will show:
  - "Database error checking existing church: ..."
  - "Database error inserting church: ..."
  - "Error generating token: ..."
  - "Error hashing password: ..."

### 2. Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to register
4. Click on the failed request (`/api/auth/register`)
5. Go to **Response** tab
6. You should see the error details

### 3. Common Issues

#### Issue: "Database not initialized"
**Fix:** Restart your server
```bash
cd server
npm start
```

#### Issue: "JWT_SECRET not set"
**Fix:** Make sure `JWT_SECRET` is in `server/.env`

#### Issue: "Database error inserting church"
**Possible causes:**
- Database file locked
- Schema mismatch
- Missing columns

**Fix:** Check database schema matches

#### Issue: Email service error
**Note:** Email errors are now caught and won't break registration, but check server logs

### 4. Quick Test

Run this to test the registration endpoint directly:

```bash
cd server
node test-registration.js
```

This will show you the exact error.

## What to Share

If it still fails, please share:
1. **Server console output** - the exact error message
2. **Browser Network tab** - the response from the failed request
3. **Any error details** you see

The improved error logging should now show exactly what's failing!

