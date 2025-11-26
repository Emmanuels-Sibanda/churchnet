# Debugging Blank Page Issue

## Quick Checks

### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for errors:
- Red errors indicate JavaScript issues
- Network tab shows if API calls are failing

### 2. Verify Backend is Running
```bash
# Check if backend is responding
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"Server is running"}
```

### 3. Check Network Tab
- Open DevTools → Network tab
- Look for failed requests (red)
- Check if `/api/health` returns 200

### 4. Common Issues

#### Issue: "Cannot GET /"
**Cause:** Backend not running or wrong port
**Fix:** Start backend server on port 5000

#### Issue: "Network Error" or CORS errors
**Cause:** Backend not running or CORS misconfigured
**Fix:** 
1. Verify backend is running: `http://localhost:5000/api/health`
2. Check `server/.env` has `CORS_ORIGIN=http://localhost:3000`

#### Issue: Blank page with no errors
**Cause:** React app not rendering
**Fix:**
1. Check if `#root` element exists in HTML
2. Check browser console for React errors
3. Verify all dependencies installed: `cd client && npm install`

#### Issue: "Module not found"
**Cause:** Missing dependencies
**Fix:** 
```bash
cd client
npm install
```

#### Issue: Proxy errors
**Cause:** Backend not accessible
**Fix:**
1. Ensure backend is running on port 5000
2. Check `client/package.json` has: `"proxy": "http://localhost:5000"`

## Step-by-Step Debugging

### Step 1: Verify Backend
```bash
# Terminal 1
cd server
npm run dev

# Should see:
# Server running on port 5000
# Connected to SQLite database
```

### Step 2: Verify Frontend
```bash
# Terminal 2
cd client
npm start

# Should see:
# Compiled successfully!
# Local: http://localhost:3000
```

### Step 3: Check Browser
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Check Console for errors
4. Check Network tab for failed requests

### Step 4: Test API Connection
In browser console, run:
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Should return: `{status: "OK", message: "Server is running"}`

## Error Messages & Solutions

### "JWT_SECRET is not set"
**Solution:** Create `server/.env` with JWT_SECRET

### "EADDRINUSE: address already in use :::5000"
**Solution:** Kill process on port 5000:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot find module 'axios'"
**Solution:** Install dependencies:
```bash
cd client
npm install
```

### "Proxy error: Could not proxy request"
**Solution:** 
1. Ensure backend is running
2. Check backend is on port 5000
3. Verify proxy in `client/package.json`

## Manual Test

1. **Backend Health Check:**
   ```
   http://localhost:5000/api/health
   ```

2. **Frontend Root:**
   ```
   http://localhost:3000
   ```

3. **Test Login:**
   - Go to http://localhost:3000/login
   - Use: admin@church.com / admin123
   - Check console for errors

## Still Not Working?

1. Clear browser cache
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Restart both servers
4. Check firewall/antivirus blocking ports
5. Try different browser
6. Check if ports 3000 and 5000 are available

