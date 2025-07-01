import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container">
      <div className="empty-state">
        <div style={{
          fontSize: '6rem',
          marginBottom: '1rem'
        }}>
          🔍
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#2d3748'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#4a5568'
        }}>
          Page Not Found
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: '#718096'
        }}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          
          <Link to="/cart" className="btn btn-secondary">
            View Cart
          </Link>
        </div>
        
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: '#f7fafc',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: '3rem auto 0'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>
            Looking for something specific?
          </h4>
          <ul style={{
            textAlign: 'left',
            color: '#4a5568',
            paddingLeft: '1.5rem'
          }}>
            <li>Check our <Link to="/" style={{ color: '#4f46e5' }}>featured products</Link></li>
            <li>Review items in your <Link to="/cart" style={{ color: '#4f46e5' }}>shopping cart</Link></li>
            <li>Contact support if you need assistance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 