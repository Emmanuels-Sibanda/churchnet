# 🚀 Deployment Package for Hepsia cPanel

This package contains everything needed to deploy the Church Venue application to Hepsia cPanel hosting.

## 📦 Package Contents

```
deployment/
├── server/              # Backend server files
├── public/              # React production build
├── .env.example         # Environment variables template
├── .htaccess            # Apache configuration (if needed)
├── package.json        # Production dependencies
├── DEPLOY_INSTRUCTIONS.md  # Step-by-step deployment guide
└── CHECKLIST.md         # Post-deployment checklist
```

## 🎯 Quick Start

1. **Build the application:**
   ```bash
   npm run build:deploy
   ```

2. **Create deployment package:**
   ```bash
   npm run package:deploy
   ```

3. **Upload to cPanel:**
   - Upload the `deployment` folder contents to your hosting
   - Follow `DEPLOY_INSTRUCTIONS.md`

## 📋 Pre-Deployment Checklist

- [ ] Build React app (`npm run build` in client folder)
- [ ] Set production environment variables
- [ ] Test locally with `NODE_ENV=production`
- [ ] Verify database connection
- [ ] Test email sending
- [ ] Review security settings

## 🔧 Requirements

- Node.js 18+ (check cPanel Node.js Selector)
- SQLite (or MySQL for production)
- SSL Certificate (HTTPS)
- SMTP access (for emails)

## 📞 Support

See `DEPLOY_INSTRUCTIONS.md` for detailed step-by-step guide.

