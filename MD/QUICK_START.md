# Quick Start Guide

## Starting the Servers

### Option 1: Using the Start Scripts (Recommended)

**Windows:**
```bash
# Double-click or run:
start-servers.bat

# OR in PowerShell:
.\start-servers.ps1
```

This will open two separate windows - one for backend, one for frontend.

### Option 2: Manual Start (Terminal)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Option 3: Using Root Script (Single Command)

```bash
npm run dev
```

This runs both servers concurrently in one terminal.

---

## Verify Servers Are Running

### Backend (Port 5000)
Open in browser or use curl:
```
http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### Frontend (Port 3000)
Open in browser:
```
http://localhost:3000
```

---

## Troubleshooting

### Server Won't Start

1. **Check if ports are in use:**
   ```powershell
   netstat -ano | findstr ":5000 :3000"
   ```

2. **Kill processes on ports:**
   ```powershell
   # Find process ID (PID) from netstat output, then:
   taskkill /PID <PID> /F
   ```

3. **Verify .env file exists:**
   ```bash
   # Should exist at: server/.env
   # Must contain:
   PORT=5000
   JWT_SECRET=<your-secret>
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # Should be >= 14.0.0
   ```

5. **Reinstall dependencies if needed:**
   ```bash
   npm run install-all
   ```

### Common Issues

**"JWT_SECRET is not set"**
- Create `server/.env` file
- Add: `JWT_SECRET=<generate-a-secret>`
- Generate secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**"Port 5000 already in use"**
- Another process is using the port
- Kill the process or change PORT in `.env`

**"Cannot find module"**
- Run: `npm run install-all` from root directory

**Frontend takes long to start**
- Normal! React apps can take 30-60 seconds to compile
- Wait for "Compiled successfully!" message

---

## Default Login

- **Email:** admin@church.com
- **Password:** admin123

---

## Server URLs

- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:3000
- **Health Check:** http://localhost:5000/api/health

---

## Stopping Servers

Press `Ctrl+C` in each terminal window, or close the terminal windows.

