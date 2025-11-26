# 🚀 Quick Deployment Guide for Hepsia cPanel

## Step 1: Build Deployment Package

Run this command in the project root:

```bash
npm run package:deploy
```

This will:
- Build the React app
- Copy all server files
- Create deployment package in `deployment/` folder
- Generate all necessary configuration files

## Step 2: Upload to cPanel

### Option A: Using cPanel File Manager

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to** `public_html` (or your domain folder)
4. **Create folder** `app` (or use subdomain)
5. **Upload all files** from `deployment/` folder:
   - Upload entire `server/` folder
   - Upload entire `public/` folder
   - Upload `.env.example` (rename to `.env` after upload)

### Option B: Using FTP/SFTP

1. **Connect via FTP client** (FileZilla, WinSCP)
2. **Upload structure:**
   ```
   public_html/app/
   ├── server/
   ├── public/
   └── .env
   ```

## Step 3: Configure Environment Variables

1. **In cPanel File Manager:**
   - Find `.env.example` file
   - Rename to `.env`
   - Edit and fill in your values:
     ```env
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=your-strong-secret-here
     CORS_ORIGIN=https://yourdomain.com
     FRONTEND_URL=https://yourdomain.com
     EMAIL_SERVICE=smtp
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     FROM_EMAIL=your-email@gmail.com
     FROM_NAME=Church Venue
     ```

## Step 4: Set Up Node.js Application

1. **In cPanel, find "Node.js Selector"** (or "Setup Node.js App")
2. **Click "Create Application"**
3. **Configure:**
   - **Node.js Version:** 18.x or 20.x (LTS)
   - **Application Root:** `/home/username/app` (your upload path)
   - **Application URL:** `/` or `/app`
   - **Application Startup File:** `server/index.js`
   - **Application Mode:** Production
4. **Add Environment Variables:**
   - Click "Edit" on your app
   - Add all variables from your `.env` file
   - Save
5. **Install Dependencies:**
   - Click "Run NPM Install"
   - Or via SSH: `cd server && npm install --production`
6. **Start Application:**
   - Click "Restart"

## Step 5: Set File Permissions

Via SSH or File Manager, set permissions:

```bash
chmod 755 server
chmod 755 server/database
chmod 755 server/uploads
chmod 644 .env
chmod 755 public
```

## Step 6: Test

1. **Visit your domain:** `https://yourdomain.com`
2. **Test registration**
3. **Test login**
4. **Check email notifications**

## 🔧 Troubleshooting

### Application won't start
- Check Node.js version (18+)
- Verify all environment variables are set
- Check file permissions
- Review logs in Node.js Selector

### 404 errors
- Verify `public/` folder is uploaded
- Check `.htaccess` is in `public/` folder
- Verify static file serving in `server/index.js`

### Database errors
- Check `server/database/` folder has write permissions (755)
- Verify database file can be created

### Email not sending
- Verify SMTP credentials
- Check email service configuration
- Review email logs

## 📋 Quick Checklist

- [ ] Built deployment package
- [ ] Uploaded all files
- [ ] Created `.env` file
- [ ] Set up Node.js app in cPanel
- [ ] Added environment variables
- [ ] Installed dependencies
- [ ] Started application
- [ ] Set file permissions
- [ ] Tested application

---

**Need more details?** See `DEPLOY_INSTRUCTIONS.md` in the deployment folder.

