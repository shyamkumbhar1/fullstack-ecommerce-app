const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables
dotenv.config();

const checks = {
  database: false,
  email: false,
  razorpay: false,
  api: false
};

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : type === 'warning' ? colors.yellow : colors.blue;
  console.log(`${color}${message}${colors.reset}`);
}

// Check MongoDB Connection
async function checkDatabase() {
  try {
    log('\n🔍 Checking MongoDB Connection...', 'info');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const dbName = conn.connection.db.databaseName;
    const host = conn.connection.host;
    
    log(`✅ MongoDB: Connected to "${dbName}" at ${host}`, 'success');
    results.passed.push('MongoDB Connection');
    checks.database = true;
    
    // Check collections
    const collections = await conn.connection.db.listCollections().toArray();
    log(`   📊 Collections: ${collections.length} (${collections.map(c => c.name).join(', ')})`, 'info');
    
    await mongoose.connection.close();
  } catch (error) {
    log(`❌ MongoDB: Failed - ${error.message}`, 'error');
    results.failed.push(`MongoDB: ${error.message}`);
    checks.database = false;
  }
}

// Check Email Configuration
function checkEmail() {
  log('\n🔍 Checking Email Configuration...', 'info');
  
  const useMailtrap = process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_TEST_INBOX_ID;
  const hasSMTP = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  
  if (useMailtrap) {
    log('✅ Email: Mailtrap configured', 'success');
    results.passed.push('Email (Mailtrap)');
    checks.email = true;
  } else if (hasSMTP) {
    log('✅ Email: SMTP configured', 'success');
    log(`   📧 Host: ${process.env.EMAIL_HOST || 'smtp.hostinger.com'}`, 'info');
    log(`   📧 Port: ${process.env.EMAIL_PORT || 587}`, 'info');
    log(`   📧 User: ${process.env.EMAIL_USER}`, 'info');
    results.passed.push('Email (SMTP)');
    checks.email = true;
  } else {
    log('⚠️  Email: Not configured (optional)', 'warning');
    results.warnings.push('Email service not configured');
    checks.email = false;
  }
}

// Check Razorpay Configuration
function checkRazorpay() {
  log('\n🔍 Checking Razorpay Configuration...', 'info');
  
  const hasRazorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
  
  if (hasRazorpay) {
    log('✅ Razorpay: Configured', 'success');
    results.passed.push('Razorpay');
    checks.razorpay = true;
  } else {
    log('⚠️  Razorpay: Not configured (optional)', 'warning');
    results.warnings.push('Razorpay not configured');
    checks.razorpay = false;
  }
}

// Check API Health
function checkAPI() {
  return new Promise((resolve) => {
    log('\n🔍 Checking API Health...', 'info');
    
    const port = process.env.PORT || 5000;
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        log(`✅ API: Server running on port ${port}`, 'success');
        results.passed.push('API Health');
        checks.api = true;
      } else {
        log(`❌ API: Server returned status ${res.statusCode}`, 'error');
        results.failed.push(`API: Status ${res.statusCode}`);
        checks.api = false;
      }
      resolve();
    });
    
    req.on('error', (error) => {
      log(`❌ API: Server not responding - ${error.message}`, 'error');
      log(`   💡 Make sure server is running on port ${port}`, 'warning');
      results.failed.push(`API: ${error.message}`);
      checks.api = false;
      resolve();
    });
    
    req.on('timeout', () => {
      log(`❌ API: Request timeout`, 'error');
      results.failed.push('API: Timeout');
      checks.api = false;
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Check Environment Variables
function checkEnvVars() {
  log('\n🔍 Checking Environment Variables...', 'info');
  
  const required = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
  const optional = ['EMAIL_USER', 'EMAIL_PASS', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'MAILTRAP_TOKEN'];
  
  required.forEach(key => {
    if (process.env[key]) {
      log(`✅ ${key}: Set`, 'success');
    } else {
      log(`❌ ${key}: Missing (required)`, 'error');
      results.failed.push(`${key} missing`);
    }
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      log(`✅ ${key}: Set`, 'success');
    } else {
      log(`⚠️  ${key}: Not set (optional)`, 'warning');
    }
  });
}

// Main Health Check
async function runHealthCheck() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏥  HEALTH CHECK - ECOMMERCE APP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Check Environment Variables
  checkEnvVars();
  
  // Check Database
  await checkDatabase();
  
  // Check Email
  checkEmail();
  
  // Check Razorpay
  checkRazorpay();
  
  // Check API (only if server is running)
  await checkAPI();
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  log(`✅ Passed: ${results.passed.length}`, 'success');
  results.passed.forEach(item => log(`   • ${item}`, 'success'));
  
  if (results.warnings.length > 0) {
    log(`\n⚠️  Warnings: ${results.warnings.length}`, 'warning');
    results.warnings.forEach(item => log(`   • ${item}`, 'warning'));
  }
  
  if (results.failed.length > 0) {
    log(`\n❌ Failed: ${results.failed.length}`, 'error');
    results.failed.forEach(item => log(`   • ${item}`, 'error'));
    console.log('\n');
    process.exit(1);
  } else {
    log('\n✅ All critical checks passed!', 'success');
    console.log('\n');
    process.exit(0);
  }
}

// Run health check
runHealthCheck();

