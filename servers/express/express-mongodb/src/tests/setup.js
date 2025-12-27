const mongoose = require('mongoose');
require('dotenv').config();

// Setup before all tests - Use real MongoDB with test database
beforeAll(async () => {
  // Use test database (ecommerce-test) or fallback to main database
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  
  if (!mongoUri) {
    throw new Error('MONGO_URI or MONGO_URI_TEST must be set in environment variables');
  }
  
  // Replace database name in URI - be very careful not to touch authentication
  // Match: /database-name?options or /database-name
  // Only replace the database name part, preserve everything else
  const testMongoUri = mongoUri.replace(/\/([^\/\?]+)(\?|$)/, '/ecommerce-test$2');
  
  // Log connection attempt (without sensitive data)
  const safeUri = testMongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log(`🔗 Connecting to test database: ${safeUri}`);
  
  try {
    // Use same connection options as main app for compatibility
    await mongoose.connect(testMongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Test MongoDB Connected to ecommerce-test database');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('URI used:', safeUri);
    // Log more details for debugging
    if (error.stack) {
      console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    throw error;
  }
});

// Cleanup after each test - DISABLED (keep data for inspection)
// Uncomment below if you want to clean after each test
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// });

// Teardown after all tests - DISABLED (keep data for manual inspection)
// Only close connection, don't drop database
afterAll(async () => {
  await mongoose.connection.close();
  console.log('✅ Test MongoDB Disconnected');
  console.log('📊 Test data preserved in ecommerce-test database');
  console.log('🗑️  To empty: Run cleanup command manually');
});

