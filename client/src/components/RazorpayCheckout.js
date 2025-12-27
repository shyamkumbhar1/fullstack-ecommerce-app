import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { loadScript } from '../utils/loadScript';
import { paymentAPI } from '../services/paymentAPI';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RazorpayCheckout = ({ orderId, amount, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load Razorpay script
    loadScript('https://checkout.razorpay.com/v1/checkout.js').then((loaded) => {
      setScriptLoaded(loaded);
      if (!loaded) {
        toast.error('Failed to load payment gateway');
      }
    });
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is loading, please wait...');
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const response = await paymentAPI.createOrder(orderId);
      const { data } = response.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopEasy',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyPayment({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              onSuccess(verifyResponse.data.data);
            } else {
              toast.error('Payment verification failed');
              onFailure();
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
            onFailure();
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            onFailure();
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      variant="primary" 
      disabled={loading || !scriptLoaded}
      className="w-100"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </Button>
  );
};

export default RazorpayCheckout;

