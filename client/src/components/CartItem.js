import React from 'react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  // Safety check for item data
  if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
    console.error('Invalid cart item:', item);
    return null;
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const safePrice = parseFloat(item.price) || 0;
  const safeQuantity = parseInt(item.quantity) || 1;

  return (
    <div className="cart-item">
      <img 
        src={item.imageURL} 
        alt={item.title}
        className="cart-item-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/80x80?text=Product';
        }}
      />
      
      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.title || 'Unknown Product'}</h4>
        <p className="cart-item-price">${safePrice.toFixed(2)} each</p>
        
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(safeQuantity - 1)}
            aria-label="Decrease quantity"
          >
            -
          </button>
          
          <span className="quantity-display">{safeQuantity}</span>
          
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(safeQuantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
          Subtotal: ${(safePrice * safeQuantity).toFixed(2)}
        </p>
      </div>
      
      <button 
        onClick={handleRemove}
        className="btn btn-danger btn-small"
        aria-label="Remove item from cart"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem; 