# cPanel Deployment Guide
## Deploying Church Venue to Hepsia cPanel Hosting

This guide will help you deploy your Church Venue application to your Hepsia cPanel hosting.

---

## 📋 Prerequisites

1. **Hepsia cPanel Access**
   - cPanel login credentials
   - FTP/SFTP access (or File Manager)
   - SSH access (if available - recommended)

2. **Domain Setup**
   - Domain pointed to your hosting
   - SSL certificate (Let's Encrypt - usually free in cPanel)

3. **Node.js Support**
   - Check if your hosting supports Node.js
   - Most Hepsia hosting supports Node.js via "Node.js Selector" in cPanel

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Application

#### 1.1 Build the Frontend
```bash
cd client
npm run build
```

This creates an optimized production build in `client/build/`

#### 1.2 Prepare Environment Variables
Create a `.env` file for production with:
```env
PORT=5000
JWT_SECRET=your-strong-secret-key-here
CORS_ORIGIN=https://yourdomain.com
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Church Venue
FRONTEND_URL=https://yourdomain.com
ADMIN_EMAILS=admin@church.com,your-admin-email@example.com
NODE_ENV=production
```

---

### Step 2: Upload Files to cPanel

#### Option A: Using cPanel File Manager

1. **Login to cPanel**
   - Go to your hosting provider's cPanel login
   - Navigate to File Manager

2. **Create Application Directory**
   - Navigate to `public_html` (or your domain's root)
   - Create folder: `church-venue` (or your preferred name)
   - Or use a subdomain: `app.yourdomain.com`

3. **Upload Files**
   - Upload the entire `server` folder contents to your directory
   - Upload the `client/build` folder contents to a `public` subfolder

#### Option B: Using FTP/SFTP

1. **Connect via FTP Client** (FileZilla, WinSCP, etc.)
   - Host: `ftp.yourdomain.com` or your server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Upload Structure:**
   ```
   public_html/
   ├── church-venue/          (or subdomain folder)
   │   ├── server files      (all server folder contents)
   │   ├── public/           (client/build contents)
   │   └── .env              (production environment variables)
   ```

---

### Step 3: Set Up Node.js Application

#### 3.1 Using Node.js Selector (cPanel)

1. **Open Node.js Selector**
   - In cPanel, find "Node.js Selector" or "Setup Node.js App"
   - Click "Create Application"

2. **Configure Application:**
   - **Node.js Version:** Select latest LTS (18.x or 20.x)
   - **Application Root:** `/home/username/church-venue` (or your path)
   - **Application URL:** `/` or `/church-venue`
   - **Application Startup File:** `index.js` (or `server/index.js` if in subfolder)
   - **Passenger Base URI:** Leave empty or set to `/church-venue`

3. **Set Environment Variables:**
   - In Node.js Selector, find your app
   - Click "Edit" or "Environment Variables"
   - Add all variables from your `.env` file:
     ```
     PORT=5000
     JWT_SECRET=your-secret
     CORS_ORIGIN=https://yourdomain.com
     SENDGRID_API_KEY=your-key
     FROM_EMAIL=noreply@yourdomain.com
     FROM_NAME=Church Venue
     FRONTEND_URL=https://yourdomain.com
     ADMIN_EMAILS=admin@church.com
     NODE_ENV=production
     ```

4. **Install Dependencies:**
   - In Node.js Selector, click "Run NPM Install"
   - Or use SSH: `cd /path/to/app && npm install --production`

5. **Start Application:**
   - Click "Restart" in Node.js Selector

---

### Step 4: Database Setup

#### Option A: Use SQLite (Simple, but not recommended for production)
- SQLite file will be created automatically
- Make sure `server/database/` folder has write permissions (755)

#### Option B: Use MySQL (Recommended for production)

1. **Create MySQL Database in cPanel:**
   - Go to "MySQL Databases" in cPanel
   - Create new database: `churchvenue_db`
   - Create user and assign to database
   - Note the connection details

2. **Update Database Connection:**
   - Install `mysql2` package: `npm install mysql2`
   - Update `server/database/db.js` to use MySQL instead of SQLite
   - Update connection string with your MySQL credentials

3. **Run Migrations:**
   - Create tables using SQL scripts
   - Or use migration tool

---

### Step 5: Configure Static File Serving

#### Update server/index.js to serve React build:

```javascript
// Serve React app static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});
```

---

### Step 6: Set Up SSL Certificate

1. **In cPanel:**
   - Go to "SSL/TLS Status"
   - Find your domain
   - Click "Run AutoSSL" (if available)
   - Or install Let's Encrypt certificate

2. **Force HTTPS:**
   - In cPanel, enable "Force HTTPS Redirect"
   - Or add to your `.htaccess` (if using Apache)

---

### Step 7: Configure File Permissions

Set correct permissions via File Manager or SSH:

```bash
# Navigate to your app directory
cd /home/username/church-venue

# Set permissions
chmod 755 server
chmod 755 server/database
chmod 644 server/database/*.db
chmod 755 server/uploads
chmod 644 .env
```

---

### Step 8: Test Your Deployment

1. **Check Application:**
   - Visit: `https://yourdomain.com`
   - Test registration
   - Test booking flow
   - Check email notifications

2. **Check Logs:**
   - In Node.js Selector, view application logs
   - Or check error logs in cPanel

---

## 🔧 Troubleshooting

### Issue: Application won't start
**Solutions:**
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check file permissions
- Review error logs in cPanel

### Issue: Database errors
**Solutions:**
- Verify database file permissions (if SQLite)
- Check database path is correct
- Ensure database folder exists and is writable

### Issue: Static files not loading
**Solutions:**
- Verify `public` folder is in correct location
- Check static file serving in `server/index.js`
- Verify file permissions

### Issue: API routes return 404
**Solutions:**
- Check that routes are prefixed with `/api`
- Verify Node.js app is running
- Check CORS settings

### Issue: Email not sending
**Solutions:**
- Verify `SENDGRID_API_KEY` is set correctly
- Check SendGrid account is verified
- Review email logs (emails will log to console if SendGrid not configured)

---

## 📝 Post-Deployment Checklist

- [ ] Application accessible at your domain
- [ ] SSL certificate installed (HTTPS working)
- [ ] User registration works
- [ ] Email notifications sending
- [ ] Bookings can be created
- [ ] Admin panel accessible
- [ ] Images uploading correctly
- [ ] Database persisting data
- [ ] Error logs reviewed

---

## 🔄 Updating Your Application

### To update after changes:

1. **Build new frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Upload new files:**
   - Upload new `client/build` contents
   - Upload updated server files

3. **Restart application:**
   - In Node.js Selector, click "Restart"
   - Or via SSH: `touch tmp/restart.txt` (if using Passenger)

---

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Check Node.js application logs
3. Verify all environment variables
4. Test locally first before deploying

---

## 🎯 Alternative: Subdomain Setup

If you want to use a subdomain (e.g., `app.yourdomain.com`):

1. **Create Subdomain in cPanel:**
   - Go to "Subdomains"
   - Create: `app` pointing to `public_html/app`

2. **Deploy to Subdomain Folder:**
   - Upload files to `public_html/app/`
   - Configure Node.js app for subdomain path

3. **Update CORS:**
   - Set `CORS_ORIGIN=https://app.yourdomain.com`
   - Set `FRONTEND_URL=https://app.yourdomain.com`

---

**Last Updated:** 2024  
**Status:** Ready for Deployment

