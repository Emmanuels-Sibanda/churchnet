/**
 * Quick Email Test Script
 * Tests Gmail SMTP configuration
 * Run from server directory: node test-email.js
 */

require('dotenv').config();
const { sendEmail, sendWelcomeEmail } = require('./services/email-smtp');

async function testEmail() {
  console.log('🧪 Testing Gmail SMTP Configuration...\n');
  
  // Check configuration
  console.log('📋 Configuration Check:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL || '❌ NOT SET');
  console.log('');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Error: SMTP configuration is incomplete!');
    console.log('Please update server/.env with your Gmail SMTP settings.');
    console.log('See GMAIL_SMTP_SETUP.md for instructions.\n');
    process.exit(1);
  }

  // Test email
  const testEmail = process.env.TEST_EMAIL || process.env.SMTP_USER;
  
  if (!testEmail) {
    console.log('❌ Error: No test email address found!');
    console.log('Set TEST_EMAIL in server/.env or use SMTP_USER\n');
    process.exit(1);
  }

  console.log(`📧 Sending test email to: ${testEmail}\n`);

  try {
    // Test 1: Simple email
    console.log('Test 1: Sending simple test email...');
    const result1 = await sendEmail(
      testEmail,
      'Test Email from Church Venue',
      '<h1>Test Email</h1><p>This is a test email from Church Venue system.</p><p>If you received this, Gmail SMTP is working correctly!</p>',
      'Test Email\n\nThis is a test email from Church Venue system.\n\nIf you received this, Gmail SMTP is working correctly!'
    );

    if (result1.success) {
      console.log('✅ Test email sent successfully!');
      console.log('   Method:', result1.method);
      if (result1.messageId) {
        console.log('   Message ID:', result1.messageId);
      }
    } else {
      console.log('❌ Failed to send test email');
      console.log('   Error:', result1.error);
      process.exit(1);
    }
    console.log('');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Welcome email template
    console.log('Test 2: Sending welcome email template...');
    const result2 = await sendWelcomeEmail(
      testEmail,
      'Test User'
    );

    if (result2.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('   Method:', result2.method);
    } else {
      console.log('❌ Failed to send welcome email');
      console.log('   Error:', result2.error);
      process.exit(1);
    }
    console.log('');

    console.log('✅ Email testing complete!');
    console.log('📬 Check your inbox (and spam folder) for the test emails.');
    console.log('   - Test email');
    console.log('   - Welcome email template\n');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Invalid App Password - make sure you\'re using App Password, not regular password');
    console.error('2. 2-Step Verification not enabled');
    console.error('3. Firewall blocking port 587');
    console.error('4. Incorrect SMTP settings in .env file');
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testEmail();


