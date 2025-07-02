const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

module.exports = router; 