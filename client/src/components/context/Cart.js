import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

function Cart() {
  const { items, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="cart-container">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Cart</h1>
          
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
        
        <div className="cart-items">
          {items.map(item => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="cart-total">
            Total: ${total.toFixed(2)}
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
            
            <button 
              onClick={clearCart}
              className="btn btn-danger"
            >
              Clear Cart
            </button>
            
            <Link 
              to="/checkout" 
              className="btn btn-primary"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 