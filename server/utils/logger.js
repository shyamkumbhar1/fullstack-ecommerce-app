/**
 * Simple Logging Utility
 * Provides clean, minimal logging throughout the application
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  constructor() {
    this.enabled = isDevelopment || process.env.ENABLE_LOGS === 'true';
  }

  // Format log message
  format(context, message, data = null) {
    const timestamp = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour12: false 
    });
    
    let logMessage = `[${timestamp}] [${context}] ${message}`;
    
    if (data) {
      logMessage += ` | ${typeof data === 'object' ? JSON.stringify(data) : data}`;
    }
    
    return logMessage;
  }

  // Info log
  info(context, message, data = null) {
    if (!this.enabled) return;
    console.log(this.format(context, message, data));
  }

  // Success log
  success(context, message, data = null) {
    if (!this.enabled) return;
    console.log(`✅ ${this.format(context, message, data)}`);
  }

  // Error log
  error(context, message, error = null) {
    // Always log errors, even in production
    const errorMsg = error instanceof Error ? error.message : error;
    console.error(`❌ ${this.format(context, message, errorMsg)}`);
    
    if (error instanceof Error && isDevelopment) {
      console.error('Stack:', error.stack);
    }
  }

  // Warning log
  warn(context, message, data = null) {
    if (!this.enabled) return;
    console.warn(`⚠️ ${this.format(context, message, data)}`);
  }
}

// Export singleton instance
module.exports = new Logger();

