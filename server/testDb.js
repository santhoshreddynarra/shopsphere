const mongoose = require('mongoose');
async function test() {
  await mongoose.connect('mongodb+srv://narrasanthosh63_db_user:Santhosh63@cluster0.mrftr96.mongodb.net/shopsphere?retryWrites=true&w=majority&appName=Cluster0');
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  console.log(JSON.stringify(lastOrder, null, 2));
  process.exit(0);
}
test();
