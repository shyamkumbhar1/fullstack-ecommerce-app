const fs = require('fs');
const path = require('path');

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Directories to skip
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'vendor',
  'uploads',
  'public'
];

// Find all .env.example files
function findEnvExampleFiles(dir, fileList = [], depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return fileList;
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      if (SKIP_DIRS.includes(file.name) || file.name.startsWith('.')) {
        continue;
      }
      
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        findEnvExampleFiles(filePath, fileList, depth + 1, maxDepth);
      } else if (file.name === '.env.example' || file.name === 'env.example.txt' || file.name === 'env.example') {
        fileList.push(filePath);
      }
    }
  } catch (err) {
    return fileList;
  }
  
  return fileList;
}

// Create .env from .env.example
function createEnvFile(examplePath) {
  const dir = path.dirname(examplePath);
  const envPath = path.join(dir, '.env');
  const relativePath = path.relative(process.cwd(), dir);
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    log(`⏭️  Skipped (already exists): ${relativePath}/.env`, 'yellow');
    return { created: false, skipped: true };
  }
  
  try {
    // Read .env.example content
    const content = fs.readFileSync(examplePath, 'utf8');
    
    // Write to .env
    fs.writeFileSync(envPath, content, 'utf8');
    
    log(`✅ Created: ${relativePath}/.env`, 'green');
    return { created: true, skipped: false };
  } catch (error) {
    log(`❌ Failed: ${relativePath}/.env - ${error.message}`, 'red');
    return { created: false, skipped: false };
  }
}

// Main function
function main() {
  const startTime = Date.now();
  
  log('\n🔧 Setting up environment files...\n', 'blue');
  
  const rootDir = process.cwd();
  const envExampleFiles = findEnvExampleFiles(rootDir);
  
  if (envExampleFiles.length === 0) {
    log('⚠️  No .env.example files found', 'yellow');
    log('💡 Tip: Create .env.example files in your projects\n', 'yellow');
    return;
  }
  
  log(`Found ${envExampleFiles.length} .env.example file(s)\n`, 'yellow');
  
  const results = {
    created: [],
    skipped: [],
    failed: []
  };
  
  // Create .env files from examples
  envExampleFiles.forEach((examplePath) => {
    const dir = path.dirname(examplePath);
    const relativePath = path.relative(rootDir, dir);
    
    const result = createEnvFile(examplePath);
    
    if (result.created) {
      results.created.push(relativePath);
    } else if (result.skipped) {
      results.skipped.push(relativePath);
    } else {
      results.failed.push(relativePath);
    }
  });
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Summary (Completed in ${duration}s):`, 'blue');
  log(`✅ Created: ${results.created.length}`, 'green');
  log(`⏭️  Skipped: ${results.skipped.length}`, 'yellow');
  log(`❌ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
  
  if (results.created.length > 0) {
    log('\n✅ Created .env files:', 'green');
    results.created.forEach(project => log(`   - ${project}`, 'green'));
  }
  
  if (results.failed.length > 0) {
    log('\n❌ Failed projects:', 'red');
    results.failed.forEach(project => log(`   - ${project}`, 'red'));
  }
  
  if (results.created.length > 0) {
    log('\n💡 Next step: Update .env files with your actual values', 'yellow');
    log('   (JWT_SECRET, API keys, database credentials, etc.)\n', 'yellow');
  }
  
  log('='.repeat(60) + '\n', 'blue');
}

main();

