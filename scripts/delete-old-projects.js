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

// Recursively delete directory
function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return { success: false, error: 'Directory does not exist' };
  }

  try {
    // Delete directory recursively
    fs.rmSync(dirPath, { recursive: true, force: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Find all old project directories (3yr, 6yr)
function findOldProjects(rootDir, dirList = [], currentPath = rootDir, depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return dirList;

  try {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const fullPath = path.join(currentPath, item.name);
        
        // Skip node_modules, .git, etc.
        if (['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.nuxt', 'vendor', 'uploads'].includes(item.name)) {
          continue;
        }

        // Check if directory name contains -3yr or -6yr
        if (item.name.includes('-3yr') || item.name.includes('-6yr')) {
          dirList.push(fullPath);
        }

        // Recursively search in subdirectories
        findOldProjects(rootDir, dirList, fullPath, depth + 1, maxDepth);
      }
    }
  } catch (error) {
    // Ignore permission errors
  }

  return dirList;
}

// Remove old project scripts from package.json
function cleanPackageJson(packageJsonPath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const oldScripts = Object.keys(scripts).filter(key => 
      key.includes('-3yr') || key.includes('-6yr')
    );

    if (oldScripts.length === 0) {
      return { cleaned: false, removed: 0 };
    }

    // Remove old scripts
    oldScripts.forEach(key => {
      delete scripts[key];
    });

    packageJson.scripts = scripts;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    
    return { cleaned: true, removed: oldScripts.length };
  } catch (error) {
    return { cleaned: false, error: error.message };
  }
}

function main() {
  const startTime = Date.now();
  
  log('\n🗑️  Deleting old projects (3yr, 6yr)...\n', 'blue');
  log('⚠️  This will permanently delete old project directories!\n', 'yellow');

  const rootDir = process.cwd();
  
  // Find all old projects
  log('🔍 Searching for old projects...\n', 'cyan');
  const oldProjects = findOldProjects(rootDir);

  if (oldProjects.length === 0) {
    log('✅ No old projects found to delete!\n', 'green');
    return;
  }

  log(`Found ${oldProjects.length} old project(s) to delete:\n`, 'yellow');
  oldProjects.forEach((project, index) => {
    const relativePath = path.relative(rootDir, project);
    log(`   ${index + 1}. ${relativePath}`, 'yellow');
  });

  log('\n' + '='.repeat(60), 'blue');
  
  const results = { deleted: [], failed: [] };

  // Delete each old project
  oldProjects.forEach((projectPath, index) => {
    const relativePath = path.relative(rootDir, projectPath);
    log(`\n[${index + 1}/${oldProjects.length}] 🗑️  Deleting: ${relativePath}`, 'cyan');

    const result = deleteDirectory(projectPath);
    
    if (result.success) {
      log(`✅ Deleted: ${relativePath}`, 'green');
      results.deleted.push(relativePath);
    } else {
      log(`❌ Failed: ${relativePath} - ${result.error}`, 'red');
      results.failed.push({ path: relativePath, error: result.error });
    }
  });

  // Clean package.json
  log('\n' + '='.repeat(60), 'blue');
  log('\n🧹 Cleaning root package.json...\n', 'cyan');
  
  const packageJsonPath = path.join(rootDir, 'package.json');
  const cleanResult = cleanPackageJson(packageJsonPath);
  
  if (cleanResult.cleaned) {
    log(`✅ Removed ${cleanResult.removed} old script(s) from package.json`, 'green');
  } else if (cleanResult.error) {
    log(`⚠️  Could not clean package.json: ${cleanResult.error}`, 'yellow');
  } else {
    log('✅ No old scripts found in package.json', 'green');
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Summary (Completed in ${duration}s):`, 'blue');
  log(`✅ Deleted: ${results.deleted.length}`, 'green');
  log(`❌ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');

  if (results.failed.length > 0) {
    log('\n❌ Failed to delete:', 'red');
    results.failed.forEach(item => {
      log(`   - ${item.path}: ${item.error}`, 'red');
    });
  }

  if (results.deleted.length > 0) {
    log('\n💡 Next steps:', 'yellow');
    log('   1. Review the changes in package.json', 'yellow');
    log('   2. Run: npm install (if needed)', 'yellow');
    log('   3. Test your remaining projects\n', 'yellow');
  }

  log('='.repeat(60) + '\n', 'blue');
}

// Run the script
main();

// Handle errors
process.on('uncaughtException', (err) => {
  log(`\n❌ Unexpected error: ${err.message}`, 'red');
  process.exit(1);
});

