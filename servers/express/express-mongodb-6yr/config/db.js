const mongoose = require('mongoose');

// 2018 Pattern: Callback-based connection
const connectDB = function() {
  // Skip database connection in test mode
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  // Mongoose 5 connection options (2018)
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, function(err) {
    if (err) {
      console.error('❌ MongoDB Connection Error:', err.message);
      
      // Check if it's an IP whitelist error
      if (err.message && err.message.includes('whitelist')) {
        console.error('\n❌ MongoDB Atlas Connection Error:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Your IP address is not whitelisted in MongoDB Atlas.');
        console.error('Please add your current IP to the Atlas IP whitelist.');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }
      
      // In development, allow server to start but warn
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Server will continue but database operations will fail!');
        console.warn('⚠️  Please fix MongoDB connection to use the application.\n');
      } else {
        // In production, exit
        process.exit(1);
      }
    } else {
      console.log('✅ MongoDB Connected');
    }
  });
};

module.exports = connectDB;
