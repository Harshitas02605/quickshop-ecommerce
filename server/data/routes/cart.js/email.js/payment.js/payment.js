const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', cartItems, customerEmail } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        customerEmail: customerEmail || 'guest@quickshop.com',
        orderItems: JSON.stringify(cartItems),
        orderId: uuidv4()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
});

// Confirm payment and log transaction
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, customerEmail, cartItems, shippingAddress } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Log transaction
      const transaction = {
        id: uuidv4(),
        paymentIntentId: paymentIntentId,
        orderId: paymentIntent.metadata.orderId,
        customerEmail: customerEmail,
        amount: paymentIntent.amount / 100, // Convert back from cents
        currency: paymentIntent.currency,
        status: 'completed',
        cartItems: cartItems,
        shippingAddress: shippingAddress,
        createdAt: new Date().toISOString(),
        stripeChargeId: paymentIntent.charges?.data[0]?.id || null
      };
      
      // Save transaction log
      await logTransaction(transaction);
      
      res.json({
        success: true,
        transaction: transaction,
        message: 'Payment confirmed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment'
    });
  }
});

// Get transaction by ID
router.get('/transaction/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    const transactionsPath = path.join(__dirname, '../data/transactions.json');
    
    if (!fs.existsSync(transactionsPath)) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    const transactionsData = fs.readFileSync(transactionsPath, 'utf8');
    const transactions = JSON.parse(transactionsData);
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
});

// Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here'
  });
});

// Helper function to log transactions
async function logTransaction(transaction) {
  try {
    const transactionsPath = path.join(__dirname, '../data/transactions.json');
    let transactions = [];
    
    // Read existing transactions if file exists
    if (fs.existsSync(transactionsPath)) {
      const transactionsData = fs.readFileSync(transactionsPath, 'utf8');
      transactions = JSON.parse(transactionsData);
    }
    
    // Add new transaction
    transactions.push(transaction);
    
    // Ensure data directory exists
    const dataDir = path.dirname(transactionsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write back to file
    fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2));
    
    console.log('Transaction logged successfully:', transaction.id);
  } catch (error) {
    console.error('Error logging transaction:', error);
    throw error;
  }
}

module.exports = router; 