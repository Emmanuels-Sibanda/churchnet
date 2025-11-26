# Troubleshooting Blank Screen

## Debugging Steps Added

I've added console.log statements to help identify where the app is failing:

1. **index.js** - Logs when React starts rendering
2. **App.js** - Logs when App component renders
3. **AuthContext.js** - Logs when auth context initializes

## What to Check

### 1. Open Browser Console (F12)
Look for these messages:
- "index.js loaded"
- "Root element: [object]"
- "Root created"
- "App rendered"
- "App component rendering"
- "AuthContext useEffect running"

### 2. Check Network Tab
- Are JavaScript files loading? (200 status)
- Any failed requests? (red entries)

### 3. Check Elements Tab
- Is there a `<div id="root">` element?
- Is it empty or does it have content?

### 4. Common Issues

#### If no console messages appear:
- JavaScript might not be loading
- Check if server is running
- Check browser console for blocked scripts

#### If "index.js loaded" but nothing else:
- React might not be mounting
- Check for syntax errors in index.js

#### If "App component rendering" but blank screen:
- Component might be rendering but CSS hiding it
- Check if ErrorBoundary caught an error
- Check if AuthContext is blocking render

## Quick Fixes to Try

1. **Clear browser cache completely:**
   - Ctrl+Shift+Delete
   - Clear cached images and files

2. **Try incognito/private window:**
   - Rules out extension conflicts

3. **Check if backend is running:**
   - http://localhost:5000/api/health should return JSON

4. **Check browser console for errors:**
   - Look for red error messages
   - Check Network tab for failed requests

5. **Try visiting directly:**
   - http://localhost:3000?diagnostic=true
   - This should show diagnostic panel if app loads

## If Still Blank

Share the console output (all messages you see) and I can help diagnose further.

