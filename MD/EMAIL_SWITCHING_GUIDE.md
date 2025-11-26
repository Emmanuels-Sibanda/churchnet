# How to Switch Email Services
## Quick Guide to Change from SendGrid to Alternatives

---

## 🔄 Quick Switch Options

### Option 1: Use Resend (Recommended - Easiest)

**Step 1: Install Resend**
```bash
cd server
npm install resend
```

**Step 2: Update Environment Variables**
```env
# Remove or comment out SendGrid
# SENDGRID_API_KEY=...

# Add Resend
RESEND_API_KEY=re_your-api-key-here
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Step 3: Update Import in Routes**
In `server/routes/auth.js` and `server/routes/bookings.js`:
```javascript
// Change from:
const { sendWelcomeEmail } = require('../services/email');

// To:
const { sendWelcomeEmail } = require('../services/email-resend');
```

**Step 4: Get Resend API Key**
1. Sign up at: https://resend.com
2. Go to API Keys
3. Create new key
4. Copy and add to `.env`

---

### Option 2: Use SMTP (Gmail/Outlook - Simplest)

**Step 1: Install Nodemailer**
```bash
cd server
npm install nodemailer
```

**Step 2: Update Environment Variables**
```env
# For Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Not regular password! See below
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Step 3: Get Gmail App Password**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use that password (not your regular password)

**Step 4: Update Import in Routes**
```javascript
// Change from:
const { sendWelcomeEmail } = require('../services/email');

// To:
const { sendWelcomeEmail } = require('../services/email-smtp');
```

---

### Option 3: Use Brevo (Best Free Tier)

**Step 1: Install Brevo**
```bash
cd server
npm install @getbrevo/brevo
```

**Step 2: Create Email Service**
Create `server/services/email-brevo.js` (similar structure to email.js)

**Step 3: Update Environment Variables**
```env
BREVO_API_KEY=your-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Step 4: Update Imports**
Change imports in `auth.js` and `bookings.js` to use `email-brevo`

---

## 📋 Recommended: Resend (Easiest Switch)

**Why Resend:**
- ✅ Modern API (similar to SendGrid)
- ✅ 3,000 emails/month free
- ✅ Easy setup
- ✅ Great documentation
- ✅ Works well in South Africa

**Quick Setup:**
1. Sign up: https://resend.com/signup
2. Get API key
3. Install: `npm install resend`
4. Update `.env` with `RESEND_API_KEY`
5. Change imports to use `email-resend.js`

**Time:** 5 minutes

---

## 📋 Alternative: Gmail SMTP (Free, No Signup)

**Why Gmail SMTP:**
- ✅ Completely free
- ✅ No third-party signup needed
- ✅ 500 emails/day (good for testing)
- ✅ Simple setup

**Quick Setup:**
1. Enable 2FA on Gmail
2. Generate App Password
3. Install: `npm install nodemailer`
4. Update `.env` with SMTP settings
5. Change imports to use `email-smtp.js`

**Time:** 10 minutes

**Limitations:**
- 500 emails/day limit
- May go to spam (less reliable)
- Requires Gmail account

---

## 📋 Alternative: Brevo (Best Free Tier)

**Why Brevo:**
- ✅ 300 emails/day free (9,000/month)
- ✅ Good for South Africa
- ✅ Marketing + transactional

**Quick Setup:**
1. Sign up: https://www.brevo.com
2. Get API key
3. Install: `npm install @getbrevo/brevo`
4. Create email service file
5. Update imports

**Time:** 15 minutes

---

## 🔧 Universal Email Service (Switch Easily)

I can create a universal email service that automatically detects which service to use based on environment variables. This way you can switch without changing code!

Would you like me to:
1. Create a universal email adapter?
2. Set up a specific service (Resend, SMTP, Brevo)?
3. Show you how to use your cPanel's built-in email?

---

## 💡 My Recommendation

**For Market Validation:**
- **Gmail SMTP** - Free, no signup, quick setup
- **Brevo** - Better free tier, more professional

**For Production:**
- **Resend** - Best balance of ease and features
- **AWS SES** - Cheapest at scale

---

**Which would you like to use?** I can set it up for you right now!

