# Alternative Email Setup Options
## If Gmail App Passwords Don't Work

Since Gmail App Passwords aren't working, here are better alternatives:

---

## 🎯 Option 1: Use Your cPanel Hosting SMTP (RECOMMENDED)

**If you have Hepsia cPanel hosting, use their SMTP!**

### Benefits:
- ✅ Usually included with hosting
- ✅ More reliable than Gmail
- ✅ No daily limits
- ✅ Better deliverability
- ✅ Already configured

### Setup:

1. **Get SMTP Details from cPanel:**
   - Login to cPanel
   - Go to **Email Accounts**
   - Create an email: `noreply@yourdomain.com`
   - Click **Connect Devices** or **Configure Mail Client**
   - Note the SMTP settings:
     - **Server:** `mail.yourdomain.com` or `smtp.yourdomain.com`
     - **Port:** 587 (TLS) or 465 (SSL)
     - **Username:** `noreply@yourdomain.com`
     - **Password:** (the email password you set)

2. **Update `server/.env`:**
   ```env
   SMTP_HOST=mail.yourdomain.com
   SMTP_PORT=587
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASS=your-email-password
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Church Venue
   FRONTEND_URL=http://localhost:3000
   ```

3. **Test:**
   ```bash
   cd server
   node test-email.js
   ```

---

## 🎯 Option 2: Use Resend (Easiest Alternative)

**3,000 emails/month FREE - No App Passwords needed!**

### Setup (5 minutes):

1. **Sign up:**
   - Go to: https://resend.com/signup
   - Create free account

2. **Get API Key:**
   - Go to: https://resend.com/api-keys
   - Click **Create API Key**
   - Name it: "Church Venue"
   - Copy the key (starts with `re_`)

3. **Update Code:**
   ```bash
   cd server
   npm install resend
   ```

4. **Update `server/routes/auth.js`:**
   ```javascript
   // Change from:
   const { sendWelcomeEmail } = require('../services/email-smtp');
   
   // To:
   const { sendWelcomeEmail } = require('../services/email-resend');
   ```

5. **Update `server/routes/bookings.js`:**
   ```javascript
   // Change from:
   const { ... } = require('../services/email-smtp');
   
   // To:
   const { ... } = require('../services/email-resend');
   ```

6. **Update `server/.env`:**
   ```env
   RESEND_API_KEY=re_your-api-key-here
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Church Venue
   FRONTEND_URL=http://localhost:3000
   ```

7. **Verify Domain (Optional):**
   - Add your domain in Resend dashboard
   - Add DNS records (for better deliverability)

---

## 🎯 Option 3: Use Brevo (Best Free Tier)

**300 emails/day FREE (9,000/month)!**

### Setup:

1. **Sign up:**
   - Go to: https://www.brevo.com
   - Create free account

2. **Get API Key:**
   - Go to: SMTP & API → API Keys
   - Create new key
   - Copy the key

3. **Update `server/.env`:**
   ```env
   BREVO_API_KEY=your-api-key
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Church Venue
   FRONTEND_URL=http://localhost:3000
   ```

4. **Install & Update:**
   ```bash
   cd server
   npm install @getbrevo/brevo
   ```
   - Update imports to use Brevo service (I can create this for you)

---

## 🎯 Option 4: Use Outlook/Hotmail SMTP

**If you have Outlook/Hotmail account:**

### Setup:

1. **Get App Password:**
   - Go to: https://account.microsoft.com/security
   - Enable 2-Step Verification
   - Go to: Security → Advanced security options → App passwords
   - Generate password for "Mail"

2. **Update `server/.env`:**
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@outlook.com
   FROM_NAME=Church Venue
   FRONTEND_URL=http://localhost:3000
   ```

---

## 📊 Comparison

| Option | Free Tier | Setup Time | Best For |
|--------|-----------|------------|----------|
| **cPanel SMTP** | Unlimited* | 5 min | Production |
| **Resend** | 3,000/month | 5 min | Easy setup |
| **Brevo** | 300/day | 10 min | High volume |
| **Outlook** | 300/day | 10 min | Personal use |

*Depends on your hosting plan

---

## 💡 My Recommendation

**For Market Validation:**
1. **cPanel SMTP** (if you have hosting) - Best option
2. **Resend** - Easiest, good free tier
3. **Brevo** - Best free tier

**For Production:**
- **cPanel SMTP** or **Resend**

---

## 🚀 Quick Setup: Resend (Recommended)

Want me to switch you to Resend? It's the easiest alternative:

1. ✅ No App Passwords needed
2. ✅ 3,000 emails/month free
3. ✅ Modern API
4. ✅ Easy setup (5 minutes)

**Just say "switch to Resend" and I'll do it!**

---

**Which option would you like to use?**
- cPanel SMTP (if you have hosting)
- Resend (easiest)
- Brevo (best free tier)
- Something else?

