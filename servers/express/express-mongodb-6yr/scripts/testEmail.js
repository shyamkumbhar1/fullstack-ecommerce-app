require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const emailService = require('../services/emailService');
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('\n🧪 Testing Email Service...\n');
  console.log('📧 Email Configuration:');
  console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
  console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set');
  console.log('\n');

  // Get test email from command line argument or use default
  const testEmailAddress = process.argv[2] || 'test@example.com';

  // Test 1: Direct SMTP Test (using .env variables)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Test 1: Direct SMTP Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Load SMTP configuration from .env file
  // If .env values are not set, use Mailtrap defaults for testing
  const smtpHost = process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io';
  const smtpPort = parseInt(process.env.EMAIL_PORT) || 2525;
  const smtpUser = process.env.EMAIL_USER || '2ff60e6f888652';
  const smtpPass = process.env.EMAIL_PASS || '8a1d4c2eecd08a';
  
  // Port 465 requires secure: true (SSL), Port 587/2525 requires secure: false (TLS)
  const isSecure = smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: smtpHost,        // Load from .env: EMAIL_HOST
    port: smtpPort,        // Load from .env: EMAIL_PORT
    secure: isSecure,      // Auto-set based on port (465 = SSL, others = TLS)
    auth: {
      user: smtpUser,     // Load from .env: EMAIL_USER
      pass: smtpPass,     // Load from .env: EMAIL_PASS
    },
  });

  try {
    console.log('📧 Sending direct SMTP test email...');
    const info = await transporter.sendMail({
      from: `"ShopEasy Test" <${smtpUser}>`,  // Use email from .env
      to: testEmailAddress,
      subject: 'SMTP Test',
      text: 'SMTP test from Nodemailer',
    });
    
    console.log('\n✅ Direct SMTP test successful!');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', testEmailAddress);
  } catch (error) {
    console.error('\n❌ Direct SMTP test failed!');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message);
    console.error('   Full Error:', error);
  }

  console.log('\n');

  // Test 2: Welcome Email Test (using emailService)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Test 2: Welcome Email Test (via emailService)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('⚠️  Email credentials not configured in .env file');
    console.error('   Skipping welcome email test');
    console.error('   Please set EMAIL_USER and EMAIL_PASS in server/.env');
  } else {
    try {
      console.log('📧 Sending test welcome email...\n');
      const result = await emailService.sendWelcomeEmail(testEmailAddress, 'Test User');
      
      if (result.success) {
        console.log('\n✅ Welcome email test successful!');
        console.log('   Message ID:', result.messageId);
      } else {
        console.log('\n❌ Welcome email test failed!');
        console.log('   Error:', result.error);
      }
    } catch (error) {
      console.error('\n❌ Welcome email test error:');
      console.error('   Error:', error.message);
      console.error('   Full Error:', error);
    }
  }
  
  // Wait a bit for email to complete
  setTimeout(() => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Email testing completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }, 2000);
}

testEmail();

