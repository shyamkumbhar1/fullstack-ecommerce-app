// Import API configuration
import { API_BASE_URL, BACKEND_URL } from '../config/api.config';

export { API_BASE_URL, BACKEND_URL };

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

