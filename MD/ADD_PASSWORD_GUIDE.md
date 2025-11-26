# Add Gmail App Password to Configuration

## ✅ You Have Your App Password!

Your App Password: `qnezqazmznkwspsg`

---

## 📝 Step 1: Update `server/.env` File

Open `server/.env` and add/update these settings:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=qnezqazmznkwspsg
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your-email@gmail.com` with your actual Gmail address!

---

## 🧪 Step 2: Test the Configuration

Run the test script:

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

## ⚠️ Security Note

- ✅ The `.env` file is already in `.gitignore` (won't be committed)
- ✅ Never share your App Password publicly
- ✅ If you commit to git, make sure `.env` is not included

---

## 🎯 Next Steps

1. ✅ Add password to `server/.env`
2. ✅ Add your Gmail email address
3. ✅ Run test: `cd server && node test-email.js`
4. ✅ Check your email inbox!

---

**Ready to test?** Update `server/.env` with your Gmail address and the password, then run the test!

