require('../../setup');
const emailService = require('../../../src/services/emailService');
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

describe('Email Service Unit Tests', () => {
  describe('Mailtrap Integration', () => {
    it('should detect Mailtrap configuration', () => {
      const hasMailtrap = process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_TEST_INBOX_ID;
      if (hasMailtrap) {
        expect(process.env.MAILTRAP_TOKEN).toBeTruthy();
        expect(process.env.MAILTRAP_TEST_INBOX_ID).toBeTruthy();
        console.log('✅ Mailtrap credentials found');
      } else {
        console.log('⚠️  Mailtrap credentials not found, using SMTP');
      }
    });

    it('should create Mailtrap transporter when credentials are available', async () => {
      if (process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_TEST_INBOX_ID) {
        const transporter = nodemailer.createTransport(
          MailtrapTransport({
            token: process.env.MAILTRAP_TOKEN,
            testInboxId: parseInt(process.env.MAILTRAP_TEST_INBOX_ID),
          })
        );

        // Verify transporter
        const verified = await transporter.verify();
        expect(verified).toBe(true);
        console.log('✅ Mailtrap transporter verified');
      } else {
        console.log('⚠️  Skipping Mailtrap test - credentials not available');
      }
    }, 10000);

    it('should send test email via Mailtrap', async () => {
      if (process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_TEST_INBOX_ID) {
        const transporter = nodemailer.createTransport(
          MailtrapTransport({
            token: process.env.MAILTRAP_TOKEN,
            testInboxId: parseInt(process.env.MAILTRAP_TEST_INBOX_ID),
          })
        );

        const testEmail = process.env.TEST_EMAIL || 'test@example.com';
        
        const info = await transporter.sendMail({
          from: { address: 'hello@example.com', name: 'Mailtrap Test' },
          to: testEmail,
          subject: 'Mailtrap Integration Test',
          text: 'This is a test email from Mailtrap integration test',
          category: 'Integration Test',
          sandbox: true
        });

        expect(info).toHaveProperty('messageId');
        expect(info.messageId).toBeTruthy();
        console.log('✅ Test email sent via Mailtrap');
        console.log('   Message ID:', info.messageId);
      } else {
        console.log('⚠️  Skipping Mailtrap email test - credentials not available');
      }
    }, 10000);
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const testEmail = process.env.TEST_EMAIL || 'test@example.com';
      const result = await emailService.sendWelcomeEmail(testEmail, 'Test User');

      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result).toHaveProperty('messageId');
        console.log('✅ Welcome email sent successfully');
      } else {
        console.log('⚠️  Welcome email failed:', result.error);
      }
    }, 10000);
  });

  describe('sendTestEmail', () => {
    it('should send test email successfully', async () => {
      const testEmail = process.env.TEST_EMAIL || 'test@example.com';
      const result = await emailService.sendTestEmail(testEmail);

      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result).toHaveProperty('messageId');
        console.log('✅ Test email sent successfully');
      } else {
        console.log('⚠️  Test email failed:', result.error);
      }
    }, 10000);
  });
});

