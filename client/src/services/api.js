import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add session ID
api.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem('cart_session_id');
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product API endpoints
export const productAPI = {
  // Get all products
  getProducts: () => api.get('/products'),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
};

// Cart API endpoints
export const cartAPI = {
  // Get cart items
  getCart: (sessionId) => api.get(`/cart/${sessionId}`),
  
  // Add item to cart
  addToCart: (sessionId, productId, quantity = 1) => 
    api.post(`/cart/${sessionId}/add`, { productId, quantity }),
  
  // Update item quantity
  updateQuantity: (sessionId, productId, quantity) => 
    api.put(`/cart/${sessionId}/update/${productId}`, { quantity }),
  
  // Remove item from cart
  removeFromCart: (sessionId, productId) => 
    api.delete(`/cart/${sessionId}/remove/${productId}`),
  
  // Clear cart
  clearCart: (sessionId) => api.delete(`/cart/${sessionId}/clear`),
};

// Payment API endpoints
export const paymentAPI = {
  // Get Stripe configuration
  getConfig: () => api.get('/payment/config'),
  
  // Create payment intent
  createPaymentIntent: (amount, currency, cartItems, customerEmail) => 
    api.post('/payment/create-payment-intent', {
      amount,
      currency,
      cartItems,
      customerEmail,
    }),
  
  // Confirm payment
  confirmPayment: (paymentIntentId, customerEmail, cartItems, shippingAddress) => 
    api.post('/payment/confirm-payment', {
      paymentIntentId,
      customerEmail,
      cartItems,
      shippingAddress,
    }),
  
  // Get transaction details
  getTransaction: (transactionId) => api.get(`/payment/transaction/${transactionId}`),
};

// Email API endpoints
export const emailAPI = {
  // Send confirmation email
  sendConfirmation: (customerEmail, transaction, cartItems) => 
    api.post('/email/send-confirmation', {
      customerEmail,
      transaction,
      cartItems,
    }),
  
  // Test email configuration
  testEmail: () => api.post('/email/test'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
  return {
    success: false,
    error: message,
    status: error.response?.status,
  };
};

// Helper function to extract data from API response
export const getApiData = (response) => {
  return response.data?.data || response.data;
};

export default api; 