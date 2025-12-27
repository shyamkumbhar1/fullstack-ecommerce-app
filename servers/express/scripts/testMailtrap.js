require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

async function testMailtrap() {
  console.log('\n🧪 Testing Mailtrap Integration...\n');

  // Check Mailtrap credentials
  if (!process.env.MAILTRAP_TOKEN || !process.env.MAILTRAP_TEST_INBOX_ID) {
    console.error('❌ Mailtrap credentials not found!');
    console.error('   Please set MAILTRAP_TOKEN and MAILTRAP_TEST_INBOX_ID in .env file');
    process.exit(1);
  }

  console.log('📧 Mailtrap Configuration:');
  console.log('   MAILTRAP_TOKEN:', process.env.MAILTRAP_TOKEN ? 'Set (hidden)' : 'Not set');
  console.log('   MAILTRAP_TEST_INBOX_ID:', process.env.MAILTRAP_TEST_INBOX_ID || 'Not set');
  console.log('\n');

  // Get test email from command line or use default
  const testEmail = process.argv[2] || process.env.TEST_EMAIL || 'test@example.com';

  try {
    // Create Mailtrap transporter
    console.log('📧 Creating Mailtrap transporter...');
    const transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN,
        testInboxId: parseInt(process.env.MAILTRAP_TEST_INBOX_ID),
      })
    );

    // Verify transporter
    console.log('📧 Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully!\n');

    // Send test email
    console.log('📧 Sending test email...');
    console.log('   To:', testEmail);
    
    const info = await transporter.sendMail({
      from: { address: 'hello@example.com', name: 'Mailtrap Test' },
      to: testEmail,
      subject: 'Mailtrap Integration Test ✅',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Mailtrap Test</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">Mailtrap Integration Test</h2>
          <p>This is a test email sent via Mailtrap Transport.</p>
          <p><strong>Status:</strong> ✅ Successfully integrated!</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `,
      text: 'This is a test email sent via Mailtrap Transport. Status: Successfully integrated!',
      category: 'Integration Test',
      sandbox: true
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', testEmail);
    console.log('\n📧 Check your Mailtrap inbox to see the email:');
    console.log('   https://mailtrap.io/inboxes/' + process.env.MAILTRAP_TEST_INBOX_ID + '/messages');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Mailtrap integration test completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Mailtrap test failed!');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message);
    console.error('   Full Error:', error);
    process.exit(1);
  }
}

testMailtrap();

