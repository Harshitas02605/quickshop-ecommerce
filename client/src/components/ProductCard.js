import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, isInCart, getCartItem } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const cartItem = getCartItem(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="product-card">
      <img 
        src={product.imageURL} 
        alt={product.title}
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
        }}
      />
      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        
        <button 
          onClick={handleAddToCart}
          className="btn btn-primary btn-full"
        >
          {inCart ? `Add More (${cartItem?.quantity} in cart)` : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard; 