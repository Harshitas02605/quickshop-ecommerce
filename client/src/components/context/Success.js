import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const transaction = location.state?.transaction;
  const email = location.state?.email;

  return (
    <div className="container">
      <div className="success-container">
        <div className="success-icon">
          ✓
        </div>
        
        <h1 style={{ color: '#10b981', marginBottom: '1rem' }}>
          Payment Successful!
        </h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#4a5568' }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        
        {transaction && (
          <div style={{ 
            background: '#f7fafc', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            textAlign: 'left',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Order Details</h3>
            <p><strong>Order ID:</strong> {transaction.orderId}</p>
            <p><strong>Transaction ID:</strong> {transaction.id}</p>
            <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
            {email && <p><strong>Email:</strong> {email}</p>}
          </div>
        )}
        
        <div style={{ 
          background: '#e6fffa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #81e6d9'
        }}>
          <h4 style={{ color: '#234e52', marginBottom: '0.5rem' }}>What's Next?</h4>
          <ul style={{ 
            textAlign: 'left', 
            color: '#2c7a7b',
            paddingLeft: '1.5rem'
          }}>
            <li>You will receive a confirmation email shortly</li>
            <li>Your order will be processed within 1-2 business days</li>
            <li>You'll get a shipping notification once your items are dispatched</li>
            <li>Keep your order ID for tracking and support</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="btn btn-secondary"
          >
            Print Receipt
          </button>
        </div>
        
        <div style={{ 
          marginTop: '3rem', 
          padding: '1rem', 
          fontSize: '0.9rem', 
          color: '#718096',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p>Need help? Contact our support team with your order ID.</p>
          <p>Email: support@quickshop.com | Phone: 1-800-QUICKSHOP</p>
        </div>
      </div>
    </div>
  );
}

export default Success; 