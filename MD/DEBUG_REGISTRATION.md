# Debug Registration 500 Error

## Steps to Debug

1. **Check Server Console**
   - Look at the server terminal/console
   - Check for error messages when registration is attempted
   - The improved error logging should show the exact error

2. **Common Issues:**

   ### Database Connection
   - Check if database file exists: `server/database/church_venue.db`
   - Check database permissions
   - Verify database is initialized

   ### Email Service
   - Check if SMTP settings are correct in `.env`
   - Email errors shouldn't cause 500 (they're caught), but verify

   ### Missing Fields
   - Check if all required fields are being sent from frontend
   - Verify `privacy_accepted` and `privacy_accepted_date` aren't being sent (they're added server-side)

3. **Test Registration with curl:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Church",
    "email": "test@example.com",
    "password": "Test123!@#",
    "phone": "1234567890",
    "city": "Pretoria",
    "province": "Gauteng"
  }'
```

4. **Check Browser Network Tab:**
   - Open browser DevTools → Network tab
   - Try registration
   - Click on the failed request
   - Check Response tab for error details

5. **Check Server Logs:**
   - Look at server console output
   - Should now show detailed error messages

## Quick Fixes

If the error is:
- **"Database error"** → Check database file and permissions
- **"Failed to register church"** → Check database schema matches
- **"Failed to generate token"** → Check JWT_SECRET in .env
- **"Failed to process password"** → Check bcrypt installation

