const mongoose = require('mongoose');
require('dotenv').config();
const { getTestDatabaseUri } = require('../tests/utils/mongoUriHelper');

async function checkTestData() {
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
    console.log('📊 TEST DATABASE DATA CHECK');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 No collections found. Database is empty.\n');
    } else {
      console.log(`📁 Found ${collections.length} collection(s):\n`);
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  📄 ${col.name}: ${count} document(s)`);
        
        // Show sample documents (first 3)
        if (count > 0) {
          const samples = await db.collection(col.name).find({}).limit(3).toArray();
          console.log(`     Sample documents:`);
          samples.forEach((doc, idx) => {
            const preview = JSON.stringify(doc).substring(0, 100);
            console.log(`     ${idx + 1}. ${preview}...`);
          });
          if (count > 3) {
            console.log(`     ... and ${count - 3} more`);
          }
        }
        console.log('');
      }
    }
    
    await mongoose.connection.close();
    console.log('✅ Connection closed\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTestData();

