# Quick Test Guide - Gmail SMTP

## Current Status
❌ **SMTP configuration not found in `.env` file**

---

## Step 1: Add Gmail SMTP to `.env`

Open `server/.env` and add these lines:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `your-email@gmail.com` → Your Gmail address
- `your-16-character-app-password` → Your Gmail App Password (see Step 2)

---

## Step 2: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
2. **If 2-Step Verification is OFF:**
   - Enable it first: https://myaccount.google.com/security
3. **Generate App Password:**
   - App: **Mail**
   - Device: **Other (Custom name)** → Type "Church Venue"
   - Click **Generate**
   - **Copy the 16-character password** (remove spaces)
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

## Step 3: Run Test

Once you've added the settings to `.env`, run:

```bash
cd server
node test-email.js
```

**Expected output:**
```
✅ Test email sent successfully!
✅ Welcome email sent successfully!
📬 Check your inbox (and spam folder) for the test emails.
```

---

## Step 4: Test in Application

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend  
   cd client
   npm start
   ```

2. **Test Registration:**
   - Go to: http://localhost:3000/register
   - Register a new user
   - Check email inbox for welcome email

3. **Test Booking:**
   - Create a booking
   - Check emails are sent to both booker and owner

---

## Troubleshooting

### "Invalid login" error
- ✅ Make sure you're using **App Password**, not regular password
- ✅ Check that 2-Step Verification is enabled
- ✅ Verify App Password has no spaces

### "Connection timeout" error
- ✅ Check firewall isn't blocking port 587
- ✅ Try using port 465 (update SMTP_PORT to 465)

### Emails not received
- ✅ Check spam folder
- ✅ Verify email address is correct
- ✅ Check Gmail daily limit (500 emails/day)

### Configuration not loading
- ✅ Make sure `.env` file is in `server/` directory
- ✅ Restart server after updating `.env`
- ✅ Check for typos in variable names

---

## Quick Checklist

- [ ] Gmail App Password generated
- [ ] SMTP settings added to `server/.env`
- [ ] Test script run successfully
- [ ] Welcome email received
- [ ] Booking emails working

---

**Ready to test?** Add the SMTP settings to `server/.env` and run `node server/test-email.js`

