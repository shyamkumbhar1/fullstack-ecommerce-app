/**
 * Environment Loader Helper
 * Loads root .env first (common), then project .env (overrides)
 */
const path = require('path');
const dotenv = require('dotenv');

function loadEnv(projectDir = null) {
  // Get root directory (where this script is located)
  const rootDir = path.resolve(__dirname, '..');
  const rootEnvPath = path.join(rootDir, '.env');
  
  // Load root .env first (common variables)
  const rootResult = dotenv.config({ path: rootEnvPath });
  
  // Load project-specific .env if provided (overrides)
  if (projectDir) {
    const projectEnvPath = path.join(projectDir, '.env');
    const projectResult = dotenv.config({ path: projectEnvPath });
    return { root: rootResult, project: projectResult };
  }
  
  return { root: rootResult };
}

module.exports = loadEnv;

