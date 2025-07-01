import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { itemCount } = useCart();
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            QuickShop
          </Link>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Products
            </Link>
            
            <Link to="/cart" className="cart-icon">
              <span>🛒</span>
              {itemCount > 0 && (
                <span className="cart-count">{itemCount}</span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 