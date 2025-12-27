const { execSync } = require('child_process');
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
const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.nuxt', 'vendor', 'uploads'];

// Find all package.json files with test scripts
function findTestableProjects(dir, fileList = [], depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return fileList;
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      if (SKIP_DIRS.includes(file.name) || file.name.startsWith('.')) {
        continue;
      }
      
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        findTestableProjects(filePath, fileList, depth + 1, maxDepth);
      } else if (file.name === 'package.json') {
        try {
          const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          // Check if project has test script
          if (pkg.scripts && (pkg.scripts.test || pkg.scripts['test:all'] || pkg.scripts['test:unit'] || pkg.scripts['test:integration'])) {
            fileList.push({ path: filePath, package: pkg });
          }
        } catch (err) {
          // Skip invalid package.json
        }
      }
    }
  } catch (err) {
    return fileList;
  }
  
  return fileList;
}

// Run tests for a project
function runTests(projectPath, index, total) {
  const dir = path.dirname(projectPath);
  const relativePath = path.relative(process.cwd(), dir);
  
  // Skip root package.json
  if (dir === process.cwd()) {
    return { success: true, skipped: true };
  }
  
  try {
    log(`\n[${index}/${total}] 🧪 Testing: ${relativePath}`, 'cyan');
    
    // Check if tests directory exists
    const testsDir = path.join(dir, 'tests');
    const srcTestsDir = path.join(dir, 'src', 'tests');
    
    if (!fs.existsSync(testsDir) && !fs.existsSync(srcTestsDir)) {
      log(`   ⏭️  No tests found, skipping`, 'yellow');
      return { success: true, skipped: true };
    }
    
    // Run tests (use test:all if available, else test)
    const pkg = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
    const testCmd = pkg.scripts['test:all'] ? 'npm run test:all' : 'npm test';
    
    execSync(testCmd, {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
      timeout: 300000 // 5 minutes per project
    });
    
    log(`✅ Tests passed: ${relativePath}`, 'green');
    return { success: true, skipped: false };
  } catch (error) {
    log(`❌ Tests failed: ${relativePath}`, 'red');
    return { success: false, skipped: false };
  }
}

// Main function
function main() {
  const startTime = Date.now();
  
  log('\n🧪 Running tests for all projects...\n', 'blue');
  log('💡 This will test all projects with test scripts\n', 'yellow');
  
  const rootDir = process.cwd();
  const projects = findTestableProjects(rootDir);
  
  // Filter out root package.json
  const testableProjects = projects.filter(p => {
    const dir = path.dirname(p.path);
    return dir !== rootDir;
  });
  
  if (testableProjects.length === 0) {
    log('⚠️  No projects with test scripts found', 'yellow');
    return;
  }
  
  log(`Found ${testableProjects.length} projects with tests\n`, 'yellow');
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  // Run tests sequentially
  testableProjects.forEach((project, index) => {
    const result = runTests(project.path, index + 1, testableProjects.length);
    
    if (result.skipped) {
      results.skipped.push(path.relative(rootDir, path.dirname(project.path)));
    } else if (result.success) {
      results.success.push(path.relative(rootDir, path.dirname(project.path)));
    } else {
      results.failed.push(path.relative(rootDir, path.dirname(project.path)));
    }
  });
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Test Summary (Completed in ${duration}s):`, 'blue');
  log(`✅ Passed: ${results.success.length}`, 'green');
  log(`⏭️  Skipped: ${results.skipped.length}`, 'yellow');
  log(`❌ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
  
  if (results.failed.length > 0) {
    log('\n❌ Failed projects:', 'red');
    results.failed.forEach(project => log(`   - ${project}`, 'red'));
  }
  
  if (results.success.length > 0) {
    log('\n✅ Passed projects:', 'green');
    results.success.forEach(project => log(`   - ${project}`, 'green'));
  }
  
  log('\n' + '='.repeat(60) + '\n', 'blue');
}

main();

