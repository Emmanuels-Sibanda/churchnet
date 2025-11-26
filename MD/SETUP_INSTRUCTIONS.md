# Setup Instructions
## Email Notifications, Admin Panel & cPanel Deployment

---

## ✅ What Has Been Implemented

### 1. Email Notifications ✅
- **Service:** SendGrid integration
- **Templates Created:**
  - Welcome email (after registration)
  - Booking request to venue owner
  - Booking request confirmation to booker
  - Booking approval notification
  - Booking rejection notification

### 2. Admin Panel ✅
- **Backend Routes:** `/api/admin/*`
- **Frontend:** `/admin` page
- **Features:**
  - Dashboard with statistics
  - User management
  - Venue management
  - Equipment management
  - Booking oversight
  - Content moderation (delete venues/equipment)

### 3. cPanel Deployment Guide ✅
- Complete deployment instructions created
- Production configuration included

---

## 🔧 Configuration Required

### Step 1: Set Up SendGrid (Email Notifications)

1. **Create SendGrid Account:**
   - Go to: https://signup.sendgrid.com/
   - Sign up for free account (100 emails/day free)

2. **Get API Key:**
   - Login to SendGrid
   - Go to: Settings → API Keys
   - Click "Create API Key"
   - Name it: "Church Venue"
   - Select "Full Access" or "Restricted Access" (Mail Send only)
   - Copy the API key (you'll only see it once!)

3. **Verify Sender Email:**
   - Go to: Settings → Sender Authentication
   - Verify a single sender (your email)
   - Or set up domain authentication (for production)

4. **Add to Environment Variables:**
   - Open `server/.env`
   - Add:
     ```
     SENDGRID_API_KEY=SG.your-api-key-here
     FROM_EMAIL=noreply@yourdomain.com
     FROM_NAME=Church Venue
     FRONTEND_URL=http://localhost:3000
     ```

### Step 2: Configure Admin Access

1. **Set Admin Emails:**
   - Open `server/.env`
   - Add:
     ```
     ADMIN_EMAILS=admin@church.com,your-email@example.com
     ```
   - Separate multiple emails with commas

2. **Test Admin Access:**
   - Login with admin email
   - You should see "Admin" link in navbar
   - Visit `/admin` to access admin panel

### Step 3: Test Email Notifications

1. **Start Your Servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

2. **Test Registration:**
   - Register a new user
   - Check email inbox for welcome email
   - If SendGrid not configured, check server console (emails will be logged)

3. **Test Booking:**
   - Create a booking
   - Check emails:
     - Booker receives confirmation
     - Venue owner receives notification
   - Approve/reject booking
   - Check emails for status updates

---

## 📧 Email Configuration Details

### Environment Variables Needed:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Church Venue
FRONTEND_URL=https://yourdomain.com
```

### How It Works:
- **Without SendGrid:** Emails are logged to console (for testing)
- **With SendGrid:** Emails are sent via SendGrid API
- **Non-blocking:** Email sending doesn't block API responses
- **Error handling:** Email failures are logged but don't break the app

---

## 🛡️ Admin Panel Access

### Admin Authentication:
- Admin access is based on email address
- Set `ADMIN_EMAILS` in `.env` file
- Multiple admins: comma-separated emails

### Admin Features:
1. **Dashboard:**
   - Total churches, venues, equipment, bookings
   - Pending bookings count

2. **User Management:**
   - View all registered churches
   - See user details (name, email, location, join date)

3. **Content Management:**
   - View all venues and equipment
   - Delete inappropriate content
   - View associated churches

4. **Booking Oversight:**
   - View all bookings
   - See booking details
   - Monitor booking status

### Accessing Admin Panel:
1. Login with admin email
2. Click "Admin" link in navbar (only visible to admins)
3. Or navigate directly to: `http://localhost:3000/admin`

---

## 🚀 cPanel Deployment

### Quick Steps:

1. **Build Frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Prepare Files:**
   - Upload `server/` folder contents to cPanel
   - Upload `client/build/` contents to `public/` folder
   - Create `.env` file with production values

3. **Set Up Node.js App:**
   - Use Node.js Selector in cPanel
   - Set startup file: `index.js`
   - Set environment variables
   - Install dependencies: `npm install --production`

4. **Configure Database:**
   - SQLite: Ensure `database/` folder has write permissions
   - Or migrate to MySQL (recommended for production)

5. **Set Up SSL:**
   - Enable SSL in cPanel
   - Force HTTPS redirect

6. **Update Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-production-secret
   CORS_ORIGIN=https://yourdomain.com
   SENDGRID_API_KEY=your-key
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Church Venue
   FRONTEND_URL=https://yourdomain.com
   ADMIN_EMAILS=admin@church.com
   ```

**Full details:** See `CPANEL_DEPLOYMENT_GUIDE.md`

---

## 🧪 Testing Checklist

### Email Notifications:
- [ ] Welcome email sent after registration
- [ ] Booking request email to venue owner
- [ ] Booking confirmation email to booker
- [ ] Approval email sent when booking approved
- [ ] Rejection email sent when booking rejected

### Admin Panel:
- [ ] Can access `/admin` with admin email
- [ ] Dashboard shows correct statistics
- [ ] Can view all users
- [ ] Can view all venues
- [ ] Can view all equipment
- [ ] Can view all bookings
- [ ] Can delete venues/equipment
- [ ] Non-admin users cannot access admin panel

### Production Deployment:
- [ ] Application accessible at domain
- [ ] HTTPS working (SSL certificate)
- [ ] All environment variables set
- [ ] Database working
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Images uploading correctly

---

## 📝 Important Notes

### Email Service:
- **Free Tier:** 100 emails/day (SendGrid)
- **Production:** Consider upgrading if you expect more traffic
- **Fallback:** If SendGrid not configured, emails log to console

### Admin Security:
- Currently based on email address
- For production, consider:
  - Role-based access control (RBAC)
  - Admin table in database
  - More granular permissions

### Database:
- **Development:** SQLite (current)
- **Production:** Consider PostgreSQL or MySQL
- **Backup:** Set up regular backups

---

## 🆘 Troubleshooting

### Emails Not Sending:
1. Check `SENDGRID_API_KEY` is set correctly
2. Verify sender email is verified in SendGrid
3. Check server console for error messages
4. Test with SendGrid's test email feature

### Admin Panel Not Accessible:
1. Verify email is in `ADMIN_EMAILS` environment variable
2. Check you're logged in with admin email
3. Clear browser cache and try again
4. Check server console for authentication errors

### Deployment Issues:
1. Check Node.js version (should be 18+)
2. Verify all environment variables are set
3. Check file permissions
4. Review cPanel error logs
5. Test database connection

---

## ✅ Next Steps

1. **Set up SendGrid** (5 minutes)
2. **Configure admin emails** (1 minute)
3. **Test email notifications** (5 minutes)
4. **Test admin panel** (5 minutes)
5. **Deploy to cPanel** (30-60 minutes)

**Total Setup Time:** ~1-2 hours

---

**Last Updated:** 2024  
**Status:** Ready to Configure

