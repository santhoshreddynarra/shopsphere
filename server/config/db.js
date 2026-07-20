import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error(
        '   → If using local MongoDB, ensure mongod service is running.\n' +
        '   → If using MongoDB Atlas, check your MONGO_URI in .env'
      );
    }
    process.exit(1);
  }
};

export default connectDB;
