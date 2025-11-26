# Fixing Blank Page Issue

## What I've Added

1. **Error Boundary** - Catches React errors and displays them
2. **Better Error Handling** - Improved error handling in AuthContext
3. **Diagnostic Component** - Helps identify connection issues
4. **API Utility** - Better axios configuration with error handling

## Quick Fixes

### 1. Check Browser Console (F12)
Open Developer Tools and check:
- **Console tab** - Look for red errors
- **Network tab** - Check if requests are failing

### 2. Verify Backend is Running
```bash
# In a new terminal
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

If not, start backend:
```bash
cd server
npm run dev
```

### 3. Enable Diagnostic Mode
Add `?diagnostic=true` to your URL:
```
http://localhost:3000?diagnostic=true
```

This will show a diagnostic panel showing:
- Backend connection status
- API connection status
- LocalStorage status
- Any errors

### 4. Common Causes

#### Backend Not Running
**Symptom:** Blank page, console shows network errors
**Fix:** Start backend server on port 5000

#### CORS Error
**Symptom:** Console shows CORS policy errors
**Fix:** Check `server/.env` has `CORS_ORIGIN=http://localhost:3000`

#### JavaScript Error
**Symptom:** Error in console, Error Boundary may show
**Fix:** Check console for specific error message

#### Missing Dependencies
**Symptom:** "Cannot find module" errors
**Fix:** 
```bash
cd client
npm install
```

## Step-by-Step Debugging

1. **Open Browser Console (F12)**
   - Check Console tab for errors
   - Check Network tab for failed requests

2. **Test Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Test Frontend API Connection:**
   In browser console, run:
   ```javascript
   fetch('/api/health').then(r => r.json()).then(console.log)
   ```

4. **Check Diagnostic:**
   Visit: `http://localhost:3000?diagnostic=true`

5. **Clear Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache

## If Still Blank

1. **Check if React is rendering:**
   In browser console:
   ```javascript
   document.getElementById('root')
   ```
   Should return the root element

2. **Check for React errors:**
   Look for errors starting with "Error:" in console

3. **Verify all files exist:**
   - `client/src/index.js`
   - `client/src/App.js`
   - `client/src/index.css`
   - `client/src/App.css`

4. **Restart everything:**
   ```bash
   # Stop all Node processes
   # Then restart:
   cd server && npm run dev  # Terminal 1
   cd client && npm start    # Terminal 2
   ```

## Error Messages to Look For

- **"Cannot GET /"** → Backend not running
- **"Network Error"** → Backend not accessible
- **"CORS policy"** → CORS misconfigured
- **"Module not found"** → Missing dependencies
- **"JWT_SECRET is not set"** → Missing .env file

## Quick Test

Run this in browser console:
```javascript
// Test 1: Check root element
console.log('Root:', document.getElementById('root'));

// Test 2: Check backend
fetch('/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Backend error:', e));

// Test 3: Check React
console.log('React version:', React.version);
```

See `DEBUG_GUIDE.md` for more detailed troubleshooting.

