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

// Directories to skip (saves time and resources)
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'vendor',
  'uploads'
];

// Find package.json files (memory efficient)
function findPackageJsonFiles(dir, fileList = [], depth = 0, maxDepth = 5) {
  // Limit depth to prevent deep recursion
  if (depth > maxDepth) return fileList;
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      // Skip early to save resources
      if (SKIP_DIRS.includes(file.name) || file.name.startsWith('.')) {
        continue;
      }
      
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        findPackageJsonFiles(filePath, fileList, depth + 1, maxDepth);
      } else if (file.name === 'package.json') {
        fileList.push(filePath);
      }
    }
  } catch (err) {
    // Skip directories we can't read
    return fileList;
  }
  
  return fileList;
}

// Check if node_modules exists (skip if already installed)
function shouldSkipInstall(packageJsonPath) {
  const dir = path.dirname(packageJsonPath);
  const nodeModulesPath = path.join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

// Install with timeout protection
function installDependencies(packageJsonPath, index, total, reinstall = false) {
  const dir = path.dirname(packageJsonPath);
  const relativePath = path.relative(process.cwd(), dir);
  
  // Skip if already installed (unless reinstall flag is true)
  // --force: only install missing projects (skip if installed)
  // --reinstall: reinstall everything (don't skip)
  if (!reinstall && shouldSkipInstall(packageJsonPath)) {
    log(`⏭️  Skipped (already installed): ${relativePath}`, 'yellow');
    return { success: true, skipped: true };
  }
  
  // Detect older projects that need legacy-peer-deps
  const isOldProject = relativePath.includes('-3yr') || relativePath.includes('-6yr');
  const installCmd = isOldProject ? 'npm install --legacy-peer-deps --silent' : 'npm install --silent';
  
  try {
    log(`\n[${index}/${total}] 📦 Installing: ${relativePath}`, 'cyan');
    if (isOldProject) {
      log(`   ⚙️  Using --legacy-peer-deps for older project`, 'yellow');
    }
    
    // Use execSync with timeout and limited output
    execSync(installCmd, { 
      cwd: dir, 
      stdio: 'pipe', // Less output = less memory
      shell: true,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer limit
      timeout: 300000 // 5 minutes timeout per project
    });
    
    log(`✅ Completed: ${relativePath}`, 'green');
    return { success: true, skipped: false };
  } catch (error) {
    log(`❌ Failed: ${relativePath}`, 'red');
    if (error.message.includes('timeout')) {
      log(`   ⚠️  Installation timed out`, 'yellow');
    }
    return { success: false, skipped: false };
  }
}

// Main function
function main() {
  const startTime = Date.now();
  const force = process.argv.includes('--force');
  const reinstall = process.argv.includes('--reinstall');
  
  log('\n🚀 Starting npm install for all projects...\n', 'blue');
  log('💡 Tip: This runs sequentially to prevent system overload\n', 'yellow');
  
  if (reinstall) {
    log('⚠️  Reinstall mode: Will reinstall ALL projects (even if already installed)\n', 'yellow');
  } else if (force) {
    log('⚠️  Force mode: Will install missing/failed projects only (skip already installed)\n', 'yellow');
  }
  
  const rootDir = process.cwd();
  const packageJsonFiles = findPackageJsonFiles(rootDir);
  
  // Filter out root package.json
  const projectPackages = packageJsonFiles.filter(p => {
    const dir = path.dirname(p);
    return dir !== rootDir;
  });
  
  if (projectPackages.length === 0) {
    log('❌ No projects found with package.json', 'red');
    return;
  }
  
  log(`Found ${projectPackages.length} projects\n`, 'yellow');
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  // Install sequentially (one at a time - safe for laptop)
  projectPackages.forEach((packageJsonPath, index) => {
    const dir = path.dirname(packageJsonPath);
    const relativePath = path.relative(rootDir, dir);
    
    // Use reinstall flag if provided, otherwise use normal behavior (skip if installed)
    const result = installDependencies(packageJsonPath, index + 1, projectPackages.length, reinstall);
    
    if (result.skipped) {
      results.skipped.push(relativePath);
    } else if (result.success) {
      results.success.push(relativePath);
    } else {
      results.failed.push(relativePath);
    }
    
    // Small delay between installs to prevent system overload
    if (index < projectPackages.length - 1) {
      // Give system a moment to breathe
      setTimeout(() => {}, 100);
    }
  });
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Summary (Completed in ${duration}s):`, 'blue');
  log(`✅ Successful: ${results.success.length}`, 'green');
  log(`⏭️  Skipped: ${results.skipped.length}`, 'yellow');
  log(`❌ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
  
  if (results.failed.length > 0) {
    log('\n❌ Failed projects:', 'red');
    results.failed.forEach(project => log(`   - ${project}`, 'red'));
  }
  
  log('\n' + '='.repeat(60) + '\n', 'blue');
}

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  log('\n❌ Unexpected error occurred', 'red');
  log(err.message, 'red');
  process.exit(1);
});

main();

