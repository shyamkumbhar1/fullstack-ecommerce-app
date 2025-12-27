/**
 * Helper function to replace database name in MongoDB URI
 * Handles query parameters and various URI formats
 * Preserves authentication and connection parameters
 * Uses careful regex to avoid breaking authentication
 */
function getTestDatabaseUri(mongoUri) {
  if (!mongoUri) {
    throw new Error('MongoDB URI is required');
  }

  try {
    // MongoDB URI format: mongodb+srv://user:pass@host/database?options
    // or: mongodb://user:pass@host:port/database?options
    // We need to replace only the database name, preserving everything else
    
    // Pattern: Match everything up to the last slash before database name
    // This preserves: protocol, authentication, host, port, and query params
    // The regex carefully avoids touching the authentication part
    
    // For URIs with database name: mongodb://.../database?options
    if (mongoUri.includes('/') && mongoUri.match(/\/[^\/\?]+(\?|$)/)) {
      // Replace the database name (everything between last / and ? or end)
      // This preserves authentication credentials and query parameters
      const newUri = mongoUri.replace(/\/([^\/\?]+)(\?|$)/, '/ecommerce-test$2');
      return newUri;
    }
    
    // For URIs without database name: mongodb://... (no trailing slash)
    // Append the test database name
    if (mongoUri.includes('?')) {
      // Has query params, insert before ?
      return mongoUri.replace(/\?/, '/ecommerce-test?');
    } else {
      // No query params, append database name
      return `${mongoUri}/ecommerce-test`;
    }
  } catch (error) {
    console.error('Error parsing MongoDB URI:', error);
    throw new Error(`Failed to parse MongoDB URI: ${error.message}`);
  }
}

module.exports = { getTestDatabaseUri };

