#!/usr/bin/env node

/**
 * Build and Package Script for cPanel Deployment
 * This script builds the React app and prepares all files for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to check if file/directory exists
function existsSync(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// Copy directory recursively (compatible with older Node versions)
function copyDirSync(src, dest) {
  if (fs.cpSync) {
    // Node 16.7.0+
    fs.cpSync(src, dest, { recursive: true });
  } else {
    // Fallback for older versions
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const ROOT_DIR = path.join(__dirname, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const SERVER_DIR = path.join(ROOT_DIR, 'server');
const DEPLOY_DIR = path.join(ROOT_DIR, 'deployment');

console.log('🚀 Building deployment package...\n');

// Step 1: Clean deployment directory
console.log('📁 Cleaning deployment directory...');
if (existsSync(DEPLOY_DIR)) {
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// Step 2: Build React app
console.log('⚛️  Building React application...');
try {
  process.chdir(CLIENT_DIR);
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React build completed\n');
} catch (error) {
  console.error('❌ React build failed:', error.message);
  process.exit(1);
}

// Step 3: Copy server files
console.log('📦 Copying server files...');
const serverFiles = [
  'index.js',
  'package.json',
  'package-lock.json',
  'database',
  'routes',
  'middleware',
  'services',
  'uploads'
];

serverFiles.forEach(file => {
  const src = path.join(SERVER_DIR, file);
  const dest = path.join(DEPLOY_DIR, 'server', file);
  
  if (existsSync(src)) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyDirSync(src, dest);
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
    console.log(`   ✓ Copied ${file}`);
  }
});

// Step 4: Copy React build
console.log('\n📦 Copying React build...');
const buildDir = path.join(CLIENT_DIR, 'build');
const publicDir = path.join(DEPLOY_DIR, 'public');

if (existsSync(buildDir)) {
  copyDirSync(buildDir, publicDir);
  console.log('   ✓ Copied React build to public/');
} else {
  console.error('❌ React build directory not found!');
  console.error(`   Expected at: ${buildDir}`);
  console.error('   Please run "npm run build" in the client folder first.');
  process.exit(1);
}

// Step 5: Create .env.example
console.log('\n📝 Creating .env.example...');
const envExample = `# Production Environment Variables
# Copy this to .env and fill in your values

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (generate a strong random string)
JWT_SECRET=your-strong-secret-key-here-change-this-in-production

# CORS Configuration
CORS_ORIGIN=https://cvh.sibanda.africa
FRONTEND_URL=https://cvh.sibanda.africa

# Email Configuration (Choose one method)

# Option 1: Gmail SMTP
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emmanuel.sibanda@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=emmanuel.sibanda@gmail.com
FROM_NAME=Church Venue

# Option 2: Resend
# EMAIL_SERVICE=resend
# RESEND_API_KEY=your-resend-api-key
# FROM_EMAIL=noreply@cvh.sibanda.africa
# FROM_NAME=Church Venue

# Option 3: SendGrid
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=your-sendgrid-api-key
# FROM_EMAIL=noreply@cvh.sibanda.africa
# FROM_NAME=Church Venue

# Admin Configuration
ADMIN_EMAILS=emmanuel.sibanda@gmail.com
`;

fs.writeFileSync(path.join(DEPLOY_DIR, '.env.example'), envExample);
console.log('   ✓ Created .env.example');

// Step 6: Create .htaccess for Apache
console.log('\n📝 Creating .htaccess...');
const htaccess = `# Apache Configuration for React Router
# This ensures all routes are handled by index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache Static Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'public', '.htaccess'), htaccess);
console.log('   ✓ Created .htaccess');

// Step 7: Create deployment instructions
console.log('\n📝 Creating deployment instructions...');
const deployInstructions = fs.readFileSync(
  path.join(ROOT_DIR, 'MD', 'CPANEL_DEPLOYMENT_GUIDE.md'),
  'utf8'
);
fs.writeFileSync(
  path.join(DEPLOY_DIR, 'DEPLOY_INSTRUCTIONS.md'),
  deployInstructions
);
console.log('   ✓ Created DEPLOY_INSTRUCTIONS.md');

// Step 8: Create package.json for deployment
console.log('\n📝 Creating deployment package.json...');
const deployPackageJson = {
  name: 'church-venue-deployment',
  version: '1.0.0',
  description: 'Church Venue Hiring Platform - Production Deployment',
  main: 'server/index.js',
  scripts: {
    start: 'node server/index.js',
    install: 'cd server && npm install --production'
  },
  engines: {
    node: '>=18.0.0',
    npm: '>=8.0.0'
  }
};

fs.writeFileSync(
  path.join(DEPLOY_DIR, 'package.json'),
  JSON.stringify(deployPackageJson, null, 2)
);
console.log('   ✓ Created package.json');

// Step 9: Create checklist
console.log('\n📝 Creating deployment checklist...');
const checklist = `# ✅ Post-Deployment Checklist

## Pre-Deployment
- [ ] Built React app successfully
- [ ] Tested locally with production build
- [ ] Reviewed all environment variables
- [ ] Generated strong JWT_SECRET
- [ ] Configured email service

## File Upload
- [ ] Uploaded all files to cPanel
- [ ] Set correct file permissions (755 for folders, 644 for files)
- [ ] Created .env file from .env.example
- [ ] Verified database folder has write permissions

## Node.js Setup
- [ ] Created Node.js application in cPanel
- [ ] Set Node.js version (18+)
- [ ] Set application root path
- [ ] Set startup file: server/index.js
- [ ] Added all environment variables
- [ ] Ran npm install
- [ ] Started/restarted application

## Database
- [ ] Database file created (SQLite)
- [ ] Database folder has write permissions (755)
- [ ] Tested database connection

## SSL/HTTPS
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Updated CORS_ORIGIN to use https://

## Testing
- [ ] Application loads at domain
- [ ] User registration works
- [ ] User login works
- [ ] Email notifications sending
- [ ] Venue browsing works
- [ ] Booking creation works
- [ ] Image uploads work
- [ ] Admin panel accessible

## Security
- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables not exposed
- [ ] File uploads restricted to images
- [ ] Rate limiting enabled
- [ ] CORS configured correctly

## Monitoring
- [ ] Checked application logs
- [ ] Checked error logs
- [ ] Set up monitoring (if available)

## Documentation
- [ ] Documented deployment process
- [ ] Saved environment variables securely
- [ ] Documented any custom configurations
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'CHECKLIST.md'), checklist);
console.log('   ✓ Created CHECKLIST.md');

// Step 10: Create README
console.log('\n📝 Creating README...');
const readme = `# Church Venue - Deployment Package

This is the production-ready deployment package for the Church Venue Hiring Platform.

## 📦 What's Included

- **server/**: Backend Node.js application
- **public/**: React production build
- **.env.example**: Environment variables template
- **DEPLOY_INSTRUCTIONS.md**: Step-by-step deployment guide
- **CHECKLIST.md**: Post-deployment checklist

## 🚀 Quick Start

1. **Upload Files:**
   - Upload all contents of this folder to your cPanel hosting
   - Recommended location: \`public_html/app\` or subdomain folder

2. **Configure Environment:**
   - Copy \`.env.example\` to \`.env\`
   - Fill in all required values
   - See DEPLOY_INSTRUCTIONS.md for details

3. **Set Up Node.js App:**
   - Use cPanel's "Node.js Selector"
   - Set application root to your upload location
   - Set startup file: \`server/index.js\`
   - Add environment variables from your \`.env\` file

4. **Install Dependencies:**
   - In Node.js Selector, click "Run NPM Install"
   - Or via SSH: \`cd server && npm install --production\`

5. **Start Application:**
   - Click "Restart" in Node.js Selector

6. **Test:**
   - Visit your domain
   - Test registration and login
   - Verify all features work

## 📋 File Structure

\`\`\`
deployment/
├── server/              # Backend application
│   ├── index.js        # Main server file
│   ├── database/       # Database files
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── services/       # Email services
│   └── uploads/        # User uploaded images
├── public/             # React production build
│   ├── index.html      # Main HTML file
│   ├── static/         # Static assets (JS, CSS, images)
│   └── .htaccess       # Apache configuration
├── .env.example        # Environment variables template
├── package.json        # Deployment package info
├── DEPLOY_INSTRUCTIONS.md  # Detailed deployment guide
└── CHECKLIST.md        # Post-deployment checklist
\`\`\`

## 🔧 Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Database**: SQLite (included) or MySQL
- **SSL**: HTTPS certificate (required for production)
- **Email**: SMTP access or email service API key

## 📞 Support

For detailed deployment instructions, see **DEPLOY_INSTRUCTIONS.md**.

For troubleshooting, check:
- Application logs in cPanel Node.js Selector
- Error logs in cPanel
- Browser console for frontend errors

## 🔒 Security Notes

- Never commit \`.env\` file to version control
- Use strong, unique JWT_SECRET
- Keep all dependencies updated
- Enable HTTPS/SSL
- Review file upload security settings

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'README.md'), readme);
console.log('   ✓ Created README.md');

// Summary
console.log('\n✨ Deployment package created successfully!');
console.log(`\n📁 Location: ${DEPLOY_DIR}`);
console.log('\n📋 Next Steps:');
console.log('   1. Review .env.example and create .env with your values');
console.log('   2. Upload the deployment folder contents to cPanel');
console.log('   3. Follow DEPLOY_INSTRUCTIONS.md');
console.log('   4. Use CHECKLIST.md to verify deployment\n');

