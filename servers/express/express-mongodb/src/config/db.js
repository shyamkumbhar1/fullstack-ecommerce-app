const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip database connection in test mode (tests handle their own connection)
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const maxRetries = 3;
  let retryCount = 0;

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      retryCount++;
      
      // Check if it's an IP whitelist error
      if (error.message && error.message.includes('whitelist')) {
        console.error('\n❌ MongoDB Atlas Connection Error:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Your IP address is not whitelisted in MongoDB Atlas.');
        console.error('Please add your current IP to the Atlas IP whitelist:');
        console.error('https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } else {
        console.error(`❌ MongoDB Connection Error (Attempt ${retryCount}/${maxRetries}):`);
        console.error(`   ${error.message}`);
      }

      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying connection in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await attemptConnection();
      } else {
        console.error('\n❌ Failed to connect to MongoDB after', maxRetries, 'attempts');
        console.error('💡 Solutions:');
        console.error('   1. Check if MongoDB Atlas IP whitelist includes your current IP');
        console.error('   2. Verify MONGO_URI in .env file is correct');
        console.error('   3. For local development, use: mongodb://localhost:27017/ecommerce');
        console.error('   4. Check your internet connection\n');
        
        // In development, allow server to start but warn
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️  Server will continue but database operations will fail!');
          console.warn('⚠️  Please fix MongoDB connection to use the application.\n');
          return false;
        } else {
          // In production, exit
          process.exit(1);
        }
      }
    }
  };

  return await attemptConnection();
};

module.exports = connectDB;

