const mongoose = require('mongoose');
require('dotenv').config();
const { getTestDatabaseUri } = require('../tests/utils/mongoUriHelper');

async function cleanTestData() {
  try {
    const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGO_URI_TEST must be set in environment variables');
    }
    const testMongoUri = getTestDatabaseUri(mongoUri);
    
    await mongoose.connect(testMongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  CLEANING TEST DATABASE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 Database is already empty.\n');
    } else {
      console.log(`📁 Found ${collections.length} collection(s). Cleaning...\n`);
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        await db.collection(col.name).deleteMany({});
        console.log(`  ✅ Deleted ${count} document(s) from ${col.name}`);
      }
      
      // Drop database
      await db.dropDatabase();
      console.log('\n✅ Test database emptied successfully!\n');
    }
    
    await mongoose.connection.close();
    console.log('✅ Connection closed\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanTestData();

