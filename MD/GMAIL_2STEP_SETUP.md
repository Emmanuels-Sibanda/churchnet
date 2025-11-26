# Enable 2-Step Verification for Gmail App Passwords
## Step-by-Step Guide

---

## 🔐 Why You Need 2-Step Verification

Gmail requires **2-Step Verification** to be enabled before you can generate App Passwords. This is a security requirement.

---

## ✅ Step 1: Enable 2-Step Verification

### Option A: Using Your Computer

1. **Go to Google Account:**
   - Visit: https://myaccount.google.com/security

2. **Find "2-Step Verification":**
   - Scroll down to "How you sign in to Google"
   - Click on **"2-Step Verification"**

3. **Start Setup:**
   - Click **"Get Started"**
   - Enter your password if prompted

4. **Choose Verification Method:**
   - **Recommended:** Phone number (SMS)
   - Enter your phone number
   - Click **"Next"**
   - Enter the verification code sent to your phone
   - Click **"Next"**

5. **Turn On:**
   - Click **"Turn On"**
   - ✅ 2-Step Verification is now enabled!

---

### Option B: Using Your Phone

1. Open **Google app** or go to **myaccount.google.com**
2. Tap **Security**
3. Tap **2-Step Verification**
4. Follow the prompts to set it up

---

## 🔑 Step 2: Generate App Password

**Now that 2-Step Verification is enabled:**

1. **Go to App Passwords:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App Passwords

2. **Select App:**
   - Choose: **Mail**

3. **Select Device:**
   - Choose: **Other (Custom name)**
   - Type: **"Church Venue"** or **"Node.js App"**
   - Click **Generate**

4. **Copy the Password:**
   - You'll see a 16-character password
   - Example: `abcd efgh ijkl mnop`
   - **Remove spaces** when using it: `abcdefghijklmnop`
   - ⚠️ **Copy it now** - you won't see it again!

---

## 📝 Step 3: Add to Your .env File

Open `server/.env` and add:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `your-email@gmail.com` → Your Gmail address
- `abcdefghijklmnop` → Your 16-character App Password (no spaces)

---

## 🧪 Step 4: Test

```bash
cd server
node test-email.js
```

---

## ❌ If You Still Can't Generate App Passwords

### Check These:

1. **2-Step Verification Status:**
   - Go to: https://myaccount.google.com/security
   - Make sure "2-Step Verification" shows **"On"**
   - If it's "Off", enable it first (see Step 1)

2. **Account Type:**
   - **Personal Gmail:** App Passwords should work
   - **Google Workspace (Business):** Admin may need to enable it
   - **School/Organization:** May be restricted

3. **Wait a Few Minutes:**
   - Sometimes it takes a few minutes after enabling 2-Step Verification
   - Try again after 5-10 minutes

---

## 🔄 Alternative: Use "Less Secure Apps" (Not Recommended)

**Note:** Google has deprecated "Less Secure Apps". This method may not work anymore.

If App Passwords still don't work, you have these options:

### Option 1: Use OAuth2 (More Complex)
- Requires OAuth setup
- More secure
- Better for production

### Option 2: Use Different Email Service
- **Resend** (3,000 emails/month free)
- **Brevo** (300 emails/day free)
- **Mailjet** (6,000 emails/month free)

### Option 3: Use Your Hosting Provider's SMTP
- If you have cPanel hosting, use their SMTP
- Usually included with hosting
- More reliable than Gmail

---

## 💡 Quick Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] App Password copied (16 characters, no spaces)
- [ ] Added to `server/.env` file
- [ ] Test script run successfully

---

## 🆘 Still Having Issues?

**Common Problems:**

1. **"App Passwords not available"**
   - Make sure 2-Step Verification is ON
   - Wait 5-10 minutes after enabling
   - Try a different browser

2. **"Invalid login"**
   - Check App Password has no spaces
   - Make sure you're using App Password, not regular password
   - Verify email address is correct

3. **"Access denied"**
   - Your organization may have restrictions
   - Contact your Google Workspace admin

---

**Need help?** Let me know what error message you're seeing!

