import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

async function test() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment.");
    }
    await mongoose.connect(mongoUri);
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    console.log(JSON.stringify(lastOrder, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
}
test();
