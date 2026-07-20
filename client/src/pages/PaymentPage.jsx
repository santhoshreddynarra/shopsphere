import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import axios from 'axios';
import { clearCart } from '../features/cart/cartSlice.js';

// Ensure you replace this with your actual Stripe publishable key from your .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ clientSecret, orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We handle redirect manually to save the order
      },
      redirect: 'if_required'
    });

    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Create the order in the backend
        const orderResponse = await axios.post('/api/orders', {
          ...orderData,
          paymentMethod: 'Stripe',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            email_address: paymentIntent.receipt_email,
          },
          isPaid: true,
          paidAt: new Date(),
        }, { withCredentials: true });

        dispatch(clearCart());
        navigate(`/order-success/${orderResponse.data._id}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Error creating order');
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
      <PaymentElement />
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${orderData.totalPrice.toLocaleString('en-IN')}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart } = useAppSelector((state) => state.cart);
  const { addresses } = useAppSelector((state) => state.address);
  const [clientSecret, setClientSecret] = useState('');
  
  // Get selected address from local storage, or fallback to default
  const selectedAddressId = localStorage.getItem('selectedAddress');
  const deliveryAddress = addresses.find(a => a._id === selectedAddressId) || addresses.find(a => a.isDefault);

  useEffect(() => {
    if (!cart?.products?.length || !deliveryAddress) {
      navigate('/checkout');
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        const res = await axios.post('/api/payment/create-payment-intent', {
          amount: cart.totalAmount
        }, { withCredentials: true });
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error('Payment intent error', error);
      }
    };

    fetchPaymentIntent();
  }, [cart, deliveryAddress, navigate]);

  if (!clientSecret) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const orderData = {
    orderItems: cart.products.map(item => ({
      name: item.productId.name,
      qty: item.quantity,
      image: item.productId.images[0]?.url || item.productId.images[0],
      price: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
      product: item.productId._id
    })),
    shippingAddress: {
      fullName: deliveryAddress.fullName,
      addressLine1: deliveryAddress.addressLine1,
      city: deliveryAddress.city,
      postalCode: deliveryAddress.postalCode,
      country: deliveryAddress.country,
      phone: deliveryAddress.phone,
    },
    itemsPrice: cart.totalAmount,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: cart.totalAmount,
  };

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Complete Payment</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
