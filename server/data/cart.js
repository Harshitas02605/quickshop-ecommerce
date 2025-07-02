const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// In-memory cart storage (in production, use a database)
let carts = {};

// Get cart items
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = carts[sessionId] || [];
    
    res.json({
      success: true,
      data: cart,
      total: calculateCartTotal(cart)
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
});

// Add item to cart
router.post('/:sessionId/add', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }
    
    // Get product details
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Initialize cart if doesn't exist
    if (!carts[sessionId]) {
      carts[sessionId] = [];
    }
    
    // Check if item already exists in cart
    const existingItem = carts[sessionId].find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      carts[sessionId].push({
        productId,
        title: product.title,
        price: product.price,
        imageURL: product.imageURL,
        quantity: parseInt(quantity)
      });
    }
    
    res.json({
      success: true,
      data: carts[sessionId],
      total: calculateCartTotal(carts[sessionId])
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
});

// Update item quantity
router.put('/:sessionId/update/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const { quantity } = req.body;
    
    if (!carts[sessionId]) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const itemIndex = carts[sessionId].findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    if (quantity <= 0) {
      carts[sessionId].splice(itemIndex, 1);
    } else {
      carts[sessionId][itemIndex].quantity = parseInt(quantity);
    }
    
    res.json({
      success: true,
      data: carts[sessionId],
      total: calculateCartTotal(carts[sessionId])
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart'
    });
  }
});

// Remove item from cart
router.delete('/:sessionId/remove/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    
    if (!carts[sessionId]) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    carts[sessionId] = carts[sessionId].filter(item => item.productId !== productId);
    
    res.json({
      success: true,
      data: carts[sessionId],
      total: calculateCartTotal(carts[sessionId])
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
});

// Clear cart
router.delete('/:sessionId/clear', (req, res) => {
  try {
    const { sessionId } = req.params;
    carts[sessionId] = [];
    
    res.json({
      success: true,
      data: [],
      total: 0
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
});

// Helper function to calculate cart total
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

module.exports = router; 