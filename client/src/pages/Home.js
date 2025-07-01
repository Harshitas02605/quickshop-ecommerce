import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productAPI, getApiData, handleApiError } from '../services/api';
import { toast } from 'react-toastify';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getProducts();
      const productsData = getApiData(response);
      
      setProducts(productsData);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.error);
      toast.error(`Failed to load products: ${apiError.error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>No products available</h3>
          <p>Check back later for new products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="products-section">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          fontSize: '2.5rem',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Featured Products
        </h1>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home; 