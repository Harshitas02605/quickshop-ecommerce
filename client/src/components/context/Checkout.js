import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { paymentAPI, emailAPI, handleApiError } from '../services/api';
import { toast } from 'react-toastify';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

function Checkout() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/');
      return;
    }
    
    createPaymentIntent();
  }, [items, navigate]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      
      const response = await paymentAPI.createPaymentIntent(
        total,
        'usd',
        items,
        formData.email
      );
      
      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(`Payment setup failed: ${apiError.error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      toast.error('Payment system not ready. Please wait.');
      return;
    }

    // Validate form
    if (!formData.email || !formData.name || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        toast.error(`Payment failed: ${error.message}`);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await paymentAPI.confirmPayment(
          paymentIntentId,
          formData.email,
          items,
          {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          }
        );

        // Send confirmation email
        try {
          await emailAPI.sendConfirmation(
            formData.email,
            confirmResponse.data.transaction,
            items
          );
        } catch (emailError) {
          console.warn('Email confirmation failed:', emailError);
          // Don't fail the entire checkout if email fails
        }

        // Clear cart and redirect to success page
        clearCart();
        toast.success('Payment successful! Check your email for confirmation.');
        
        // Redirect with transaction data
        navigate('/success', { 
          state: { 
            transaction: confirmResponse.data.transaction,
            email: formData.email
          } 
        });
      }
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Checkout error:', error);
      toast.error(`Checkout failed: ${apiError.error}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Checkout
        </h1>

        {/* Order Summary */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Order Summary</h3>
          {items.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Shipping Address */}
          <div className="form-group">
            <label className="form-label">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          {/* Payment Information */}
          <div className="form-group">
            <label className="form-label">Card Information *</label>
            <div className="stripe-element">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="btn btn-primary btn-full"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Test card: 4242 4242 4242 4242 (any future date, any 3-digit CVC)</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 