import Stripe from 'stripe';
import crypto from 'crypto';

// node-fetch is not needed in node 18+

const endpointSecret = 'whsec_placeholder';

const generateStripeSignature = (payload, secret) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
};

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';

  // 1. Create User
  const timestamp = Date.now();
  const userRes = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'StripeTest', email: `stripe${timestamp}@test.com`, password: 'password123' })
  });
  const cookie = userRes.headers.get('set-cookie');

  // 2. Get Product
  const productRes = await fetch(`${baseUrl}/products`);
  const { products } = await productRes.json();
  const product = products[0];

  // 3. Create Order
  const orderData = {
    orderItems: [{
      name: product.name,
      qty: 1,
      image: product.images[0],
      price: product.price,
      product: product._id
    }],
    shippingAddress: {
      fullName: 'Test User',
      addressLine1: '123 Test St',
      city: 'Testville',
      postalCode: '12345',
      country: 'Testland',
      phone: '1234567890'
    },
    paymentMethod: 'Stripe',
  };

  const orderRes = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(orderData)
  });
  if (!orderRes.ok) {
    const errorText = await orderRes.text();
    console.error('Order creation failed:', errorText);
    return;
  }
  const order = await orderRes.json();
  console.log(`Created Order: ${order._id}, Total Price: ${order.totalPrice}`);

  // 4. Test Successful Payment Webhook
  const successPayload = {
    id: 'evt_test_success',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_success',
        amount: order.totalPrice * 100,
        status: 'succeeded',
        receipt_email: 'test@test.com',
        metadata: { orderId: order._id }
      }
    }
  };

  const successSig = generateStripeSignature(successPayload, endpointSecret);

  console.log('Sending Success Webhook...');
  const webhookRes = await fetch(`${baseUrl}/payment/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': successSig
    },
    body: JSON.stringify(successPayload)
  });
  console.log('Success Webhook Response:', webhookRes.status, await webhookRes.text());

  // Verify Order Status
  const checkOrderRes = await fetch(`${baseUrl}/orders/${order._id}`, {
    headers: { 'Cookie': cookie }
  });
  const checkedOrder = await checkOrderRes.json();
  console.log(`Order Paid Status (should be true): ${checkedOrder.isPaid}`);

  // 5. Test Failed Webhook (Wrong Amount)
  const failPayload = {
    id: 'evt_test_fail',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_fail',
        amount: 100, // Wrong amount!
        status: 'succeeded',
        metadata: { orderId: order._id }
      }
    }
  };
  const failSig = generateStripeSignature(failPayload, endpointSecret);

  console.log('Sending Failed Amount Webhook...');
  const webhookFailRes = await fetch(`${baseUrl}/payment/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': failSig
    },
    body: JSON.stringify(failPayload)
  });
  console.log('Failed Amount Webhook Response:', webhookFailRes.status, await webhookFailRes.text());
  
  // Verify order status again
  const checkOrderFailRes = await fetch(`${baseUrl}/orders/${order._id}`, {
    headers: { 'Cookie': cookie }
  });
  const checkedFailOrder = await checkOrderFailRes.json();
  console.log(`Order Paid Status (should still be true, duplicate ignored): ${checkedFailOrder.isPaid}`);
}

runTests().catch(console.error);
