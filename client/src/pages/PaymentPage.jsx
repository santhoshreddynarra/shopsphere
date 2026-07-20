import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch } from '../hooks/useRedux.js';
import axiosInstance from '../services/axiosInstance.js';
import { clearCart } from '../features/cart/cartSlice.js';

// Ensure you replace this with your actual Stripe publishable key from your .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ clientSecret, orderId, totalPrice }) => {
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
      // The backend webhook will mark the order as paid. We just navigate.
      dispatch(clearCart());
      navigate(`/order-success/${orderId}`);
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
        {isProcessing ? 'Processing...' : `Pay ₹${totalPrice?.toLocaleString('en-IN')}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    if (!orderId) {
      navigate('/checkout');
      return;
    }

    const fetchOrderAndPaymentIntent = async () => {
      try {
        // 1. Fetch order details to get total price
        const orderRes = await axiosInstance.get(`/orders/${orderId}`, { withCredentials: true });
        setOrder(orderRes.data);

        // 2. Fetch payment intent using order ID
        const paymentRes = await axiosInstance.post('/payment/create-payment-intent', {
          orderId
        }, { withCredentials: true });
        setClientSecret(paymentRes.data.clientSecret);
      } catch (error) {
        console.error('Error in payment setup', error);
      }
    };

    fetchOrderAndPaymentIntent();
  }, [orderId, navigate]);

  if (!clientSecret || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Complete Payment</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} orderId={orderId} totalPrice={order.totalPrice} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
