import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      'MONGO_URI is not set in environment variables.\n' +
      '  → For Atlas: MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/shopsphere\n' +
      '  → For local:  MONGO_URI=mongodb://127.0.0.1:27017/shopsphere'
    );
  }

  const isAtlas = uri.startsWith('mongodb+srv://');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout — enough for Atlas cold starts
      socketTimeoutMS: 45000,
    });

    const host = conn.connection.host;
    const dbName = conn.connection.name;
    console.log(`✅ MongoDB connected — host: ${host} | db: ${dbName}`);
  } catch (error) {
    const msg = error.message || '';

    if (msg.includes('ECONNREFUSED')) {
      throw new Error(
        `Cannot reach MongoDB at ${uri}.\n` +
        '  → Local MongoDB is not running. Start it with: mongod\n' +
        '  → OR switch to Atlas by updating MONGO_URI in server/.env'
      );
    }

    if (msg.includes('Authentication failed') || msg.includes('bad auth')) {
      throw new Error(
        'MongoDB authentication failed.\n' +
        '  → Check your Atlas username and password in MONGO_URI.\n' +
        '  → Special characters in password must be URL-encoded.'
      );
    }

    if (msg.includes('ETIMEOUT') || msg.includes('timed out')) {
      throw new Error(
        'MongoDB connection timed out.\n' +
        (isAtlas
          ? '  → Check that your IP address is whitelisted in Atlas Network Access (or allow 0.0.0.0/0 for dev).'
          : '  → Local MongoDB may be starting up. Retry in a moment.')
      );
    }

    // Re-throw unrecognised errors with original message
    throw new Error(`MongoDB connection error: ${msg}`);
  }
};

export default connectDB;
