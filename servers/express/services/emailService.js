const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');
const fs = require('fs');
const path = require('path');

// Helper function to write debug logs
const writeDebugLog = (logData) => {
  const logPath = path.join(__dirname, '../../.cursor/debug.log');
  const logLine = JSON.stringify(logData) + '\n';
  try {
    fs.appendFileSync(logPath, logLine, 'utf8');
  } catch (err) {
    // Silently fail if file can't be written
  }
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7773c587-bb6e-4643-a407-7c91a4020279',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch(()=>{});
  }
};

// Check if using Mailtrap
const useMailtrap = process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_TEST_INBOX_ID;

// Create transporter based on configuration
let transporter;

if (useMailtrap) {
  // Use Mailtrap Transport
  transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_TOKEN,
      testInboxId: parseInt(process.env.MAILTRAP_TEST_INBOX_ID),
    })
  );
  console.log('✅ [EMAIL] Using Mailtrap Transport');
} else {
  // Use SMTP (existing configuration)
  const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
  const emailHost = process.env.EMAIL_HOST || 'smtp.hostinger.com';
  const isSecure = emailPort === 465;

  transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: isSecure, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For Hostinger SMTP
      ciphers: 'SSLv3' // Allow older SSL versions if needed
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  console.log('✅ [EMAIL] Using SMTP Transport');
}

// Verify transporter configuration (non-blocking, don't fail server startup)
transporter.verify((error, success) => {
  // #region agent log
  writeDebugLog({location:'emailService.js:45',message:'Email transporter verify called',data:{useMailtrap,hasError:!!error,hasSuccess:!!success},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
  if (error) {
    // #region agent log
    writeDebugLog({location:'emailService.js:47',message:'Email verification error',data:{errorMessage:error.message,errorCode:error.code,errorName:error.name,isSSL:error.message?.includes('SSL')||error.message?.includes('TLS'),stack:error.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // #endregion
    // Log error but don't throw - allow server to start
    console.error('⚠️ [EMAIL] Email service verification failed (server will continue):');
    console.error('📧 [EMAIL] Transport:', useMailtrap ? 'Mailtrap' : 'SMTP');
    if (!useMailtrap) {
      const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
      const emailHost = process.env.EMAIL_HOST || 'smtp.hostinger.com';
      const isSecure = emailPort === 465;
      console.error('📧 [EMAIL] Host:', emailHost);
      console.error('📧 [EMAIL] Port:', emailPort, `(${isSecure ? 'SSL' : 'TLS'})`);
      console.error('📧 [EMAIL] User:', process.env.EMAIL_USER || 'Not set');
    }
    // Filter out SSL error details from being exposed
    const errorMessage = error.message || 'Connection failed';
    if (errorMessage.includes('SSL') || errorMessage.includes('TLS') || errorMessage.includes('ECONNREFUSED')) {
      console.error('📧 [EMAIL] Error: SMTP connection issue (check credentials and network)');
    } else {
      console.error('📧 [EMAIL] Error:', errorMessage);
    }
    console.log('⚠️ [EMAIL] Email sending will be attempted but may fail until configured correctly');
  } else {
    // #region agent log
    writeDebugLog({location:'emailService.js:67',message:'Email verification success',data:{useMailtrap},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // #endregion
    console.log('✅ [EMAIL] Email service is ready to send emails');
    console.log('📧 [EMAIL] Transport:', useMailtrap ? 'Mailtrap' : 'SMTP');
    if (!useMailtrap) {
      const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
      const emailHost = process.env.EMAIL_HOST || 'smtp.hostinger.com';
      const isSecure = emailPort === 465;
      console.log('📧 [EMAIL] Host:', emailHost);
      console.log('📧 [EMAIL] Port:', emailPort, `(${isSecure ? 'SSL' : 'TLS'})`);
      console.log('📧 [EMAIL] From:', process.env.EMAIL_USER || 'Not set');
    }
  }
});

// Send welcome email
exports.sendWelcomeEmail = async (userEmail, userName) => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 [EMAIL] Attempting to send welcome email');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 [EMAIL] To:', userEmail);
  console.log('👤 [EMAIL] User Name:', userName);
  console.log('⏰ [EMAIL] Time:', new Date().toLocaleString());
  
  // Check if email credentials are configured
  if (useMailtrap) {
    // Mailtrap doesn't need EMAIL_USER/EMAIL_PASS
    console.log('📧 [EMAIL] Using Mailtrap Transport');
  } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ [EMAIL] Email credentials not configured, skipping welcome email');
    console.log('📧 [EMAIL] EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('📧 [EMAIL] EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: false, error: 'Email credentials not configured' };
  }

  try {
    const mailOptions = {
      from: useMailtrap 
        ? '"ShopEasy" <hello@example.com>' 
        : `"ShopEasy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to ShopEasy! 🎉',
      ...(useMailtrap && { category: 'Welcome Email', sandbox: true }),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ShopEasy</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">Welcome to ShopEasy! 🎉</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hi <strong>${userName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for joining <strong>ShopEasy</strong>! We're excited to have you as part of our community.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your account has been created successfully. You can now:
            </p>
            
            <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
              <li>Browse our amazing collection of products</li>
              <li>Add items to your cart</li>
              <li>Place orders with secure payment options</li>
              <li>Track your orders in real-time</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                Start Shopping Now
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you have any questions, feel free to contact our support team.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
              Best regards,<br>
              <strong>The ShopEasy Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} ShopEasy. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ShopEasy! 🎉
        
        Hi ${userName},
        
        Thank you for joining ShopEasy! We're excited to have you as part of our community.
        
        Your account has been created successfully. You can now:
        - Browse our amazing collection of products
        - Add items to your cart
        - Place orders with secure payment options
        - Track your orders in real-time
        
        Start shopping now: ${process.env.CLIENT_URL || 'http://localhost:3000'}
        
        If you have any questions, feel free to contact our support team.
        
        Best regards,
        The ShopEasy Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('\n✅ [EMAIL] Welcome email sent successfully!');
    console.log('📧 [EMAIL] Message ID:', info.messageId);
    console.log('📧 [EMAIL] To:', userEmail);
    console.log('📧 [EMAIL] From:', useMailtrap ? 'Mailtrap' : process.env.EMAIL_USER);
    console.log('⏰ [EMAIL] Sent at:', new Date().toLocaleString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log('\n❌ [EMAIL] Error sending welcome email!');
    console.error('📧 [EMAIL] To:', userEmail);
    console.error('📧 [EMAIL] Transport:', useMailtrap ? 'Mailtrap' : 'SMTP');
    console.error('📧 [EMAIL] Error Code:', error.code);
    console.error('📧 [EMAIL] Error Message:', error.message);
    console.error('⏰ [EMAIL] Error time:', new Date().toLocaleString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: false, error: error.message };
  }
};

// Send simple test email
exports.sendTestEmail = async (testEmailAddress) => {
  console.log('📧 [EMAIL] Attempting to send test email to:', testEmailAddress);
  
  // Check if email credentials are configured
  if (useMailtrap) {
    console.log('📧 [EMAIL] Using Mailtrap Transport');
  } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ [EMAIL] Email credentials not configured, skipping test email');
    return { success: false, error: 'Email credentials not configured' };
  }

  try {
    const mailOptions = {
      from: useMailtrap 
        ? '"Solo Minds" <hello@example.com>' 
        : '"Solo Minds" <info@solominds.co.in>',
      to: testEmailAddress || 'test@example.com',
      subject: 'SMTP Test',
      text: 'SMTP test from Nodemailer',
      ...(useMailtrap && { category: 'Test Email', sandbox: true }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [EMAIL] Test email sent successfully!');
    console.log('📧 [EMAIL] Message ID:', info.messageId);
    console.log('📧 [EMAIL] To:', testEmailAddress);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [EMAIL] Error sending test email:');
    console.error('📧 [EMAIL] To:', testEmailAddress);
    console.error('📧 [EMAIL] Error Code:', error.code);
    console.error('📧 [EMAIL] Error Message:', error.message);
    console.error('📧 [EMAIL] Full Error:', error);
    return { success: false, error: error.message };
  }
};

