# Gmail SMTP Setup Guide
## Quick Setup Instructions

---

## ✅ Code Changes Complete!

I've already updated your code to use Gmail SMTP. Now you just need to configure it.

---

## 🔧 Step 1: Get Gmail App Password

**Important:** You cannot use your regular Gmail password. You need an "App Password".

### Instructions:

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App Passwords
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: "Church Venue"
   - Click **Generate**

3. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - Remove spaces when using it
   - Example: `abcdefghijklmnop`

---

## 📝 Step 2: Update Environment Variables

Open `server/.env` and add/update these settings:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000

# Remove or comment out SendGrid (if you had it)
# SENDGRID_API_KEY=...
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=churchvenue@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=churchvenue@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Step 3: Test It

1. **Restart your server:**
   ```bash
   cd server
   npm start
   ```

2. **Test registration:**
   - Register a new user
   - Check the email inbox for welcome email
   - Check server console for any errors

3. **Test booking:**
   - Create a booking
   - Check emails are sent to both booker and owner

---

## ⚠️ Important Notes

### Gmail Limits:
- **500 emails per day** (free Gmail account)
- **2,000 emails per day** (Google Workspace)

### Security:
- Never commit `.env` file to git
- App Password is different from your regular password
- If you change your Gmail password, you'll need a new App Password

### Troubleshooting:

**"Invalid login" error:**
- Make sure you're using App Password, not regular password
- Check that 2-Step Verification is enabled
- Verify the App Password has no spaces

**"Connection timeout" error:**
- Check your firewall isn't blocking port 587
- Try port 465 with `secure: true` (update code if needed)

**Emails going to spam:**
- This is normal for Gmail SMTP
- Consider using a dedicated email service for production
- Add SPF/DKIM records if using your own domain

---

## 🔄 Switching Back

If you want to switch back to SendGrid or another service:

1. Update imports in:
   - `server/routes/auth.js`
   - `server/routes/bookings.js`

2. Change from:
   ```javascript
   require('../services/email-smtp')
   ```

3. To:
   ```javascript
   require('../services/email')  // SendGrid
   // or
   require('../services/email-resend')  // Resend
   ```

---

## ✅ You're All Set!

Your system is now configured to use Gmail SMTP. Just:
1. ✅ Get App Password (5 minutes)
2. ✅ Update `.env` file (1 minute)
3. ✅ Restart server
4. ✅ Test!

**Total setup time:** ~6 minutes

---

**Need help?** Check server console logs for detailed error messages.

