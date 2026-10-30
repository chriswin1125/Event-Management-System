const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_db';
  const isAtlas = uri.startsWith('mongodb+srv://');

  try {
    const options = {
      serverSelectionTimeoutMS: 8000, // Timeout after 8s instead of hanging
      maxPoolSize: 10,
    };

    console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);

    const conn = await mongoose.connect(uri, options);

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`[Database] Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);

    if (isAtlas) {
      console.error('\n' + '='.repeat(60));
      console.error('⚠️  MONGODB ATLAS CONNECTION TROUBLESHOOTING GUIDE:');
      console.error('1. Network Access: Ensure your IP address (or 0.0.0.0/0 for deployment) is whitelisted in MongoDB Atlas under Network Access.');
      console.error('2. Database User: Ensure the username and password in MONGO_URI match an active user in Database Access.');
      console.error('3. Special Characters: If your password has special characters like @, #, or %, URL-encode them (e.g., @ -> %40).');
      console.error('4. Database Name: Ensure a database name is specified before query parameters (e.g., mongodb+srv://user:pass@cluster.mongodb.net/event_management_db?retryWrites=true&w=majority).');
      console.error('='.repeat(60) + '\n');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
