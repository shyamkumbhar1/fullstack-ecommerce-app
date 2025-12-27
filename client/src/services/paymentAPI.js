import api from './api';

export const paymentAPI = {
  createOrder: (orderId) => api.post('/payment/create-order', { orderId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
  syncOrder: (razorpayOrderId) => api.post('/payment/sync-order', { razorpayOrderId })
};

