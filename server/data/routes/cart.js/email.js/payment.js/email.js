const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASS || 'ethereal.pass'
    }
  });
};

// Send order confirmation email
router.post('/send-confirmation', async (req, res) => {
  try {
    const { customerEmail, transaction, cartItems } = req.body;
    
    if (!customerEmail || !transaction) {
      return res.status(400).json({
        success: false,
        error: 'Customer email and transaction details are required'
      });
    }
    
    const transporter = createTransporter();
    
    // Generate order summary HTML
    const orderSummaryHtml = generateOrderSummaryHtml(transaction, cartItems);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@quickshop.com',
      to: customerEmail,
      subject: `Order Confirmation - QuickShop (Order #${transaction.orderId})`,
      html: orderSummaryHtml,
      text: generateOrderSummaryText(transaction, cartItems)
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Confirmation email sent:', info.messageId);
    
    res.json({
      success: true,
      message: 'Confirmation email sent successfully',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) // For testing with Ethereal
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send confirmation email',
      details: error.message
    });
  }
});

// Test email configuration
router.post('/test', async (req, res) => {
  try {
    const transporter = createTransporter();
    
    // Test connection
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'Email configuration is working correctly'
    });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Email configuration test failed',
      details: error.message
    });
  }
});

// Generate HTML email template
function generateOrderSummaryHtml(transaction, cartItems) {
  const itemsHtml = cartItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.imageURL}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - QuickShop</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4f46e5; margin: 0;">QuickShop</h1>
        <p style="color: #666; margin: 5px 0;">Thank you for your order!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Order Confirmation</h2>
        <p><strong>Order ID:</strong> ${transaction.orderId}</p>
        <p><strong>Transaction ID:</strong> ${transaction.id}</p>
        <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> $${transaction.amount.toFixed(2)} ${transaction.currency.toUpperCase()}</p>
      </div>
      
      <h3 style="color: #333;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Image</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="background: #f8f9fa; font-weight: bold;">
            <td colspan="4" style="padding: 15px; text-align: right; border-top: 2px solid #4f46e5;">Total:</td>
            <td style="padding: 15px; text-align: right; border-top: 2px solid #4f46e5;">$${transaction.amount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      ${transaction.shippingAddress ? `
        <h3 style="color: #333;">Shipping Address</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 5px 0;">${transaction.shippingAddress.name}</p>
          <p style="margin: 5px 0;">${transaction.shippingAddress.address}</p>
          <p style="margin: 5px 0;">${transaction.shippingAddress.city}, ${transaction.shippingAddress.state} ${transaction.shippingAddress.postalCode}</p>
          <p style="margin: 5px 0;">${transaction.shippingAddress.country}</p>
        </div>
      ` : ''}
      
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
        <p>• You will receive a shipping confirmation email once your order is dispatched</p>
        <p>• Track your order using the order ID: <strong>${transaction.orderId}</strong></p>
        <p>• If you have any questions, contact our support team</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
        <p>Thank you for shopping with QuickShop!</p>
        <p style="font-size: 14px;">This is an automated email. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email
function generateOrderSummaryText(transaction, cartItems) {
  const itemsText = cartItems.map(item => 
    `${item.title} - Qty: ${item.quantity} - $${item.price.toFixed(2)} each - Total: $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  return `
QuickShop - Order Confirmation

Thank you for your order!

Order Details:
- Order ID: ${transaction.orderId}
- Transaction ID: ${transaction.id}
- Date: ${new Date(transaction.createdAt).toLocaleDateString()}
- Total Amount: $${transaction.amount.toFixed(2)} ${transaction.currency.toUpperCase()}

Order Items:
${itemsText}

Total: $${transaction.amount.toFixed(2)}

${transaction.shippingAddress ? `
Shipping Address:
${transaction.shippingAddress.name}
${transaction.shippingAddress.address}
${transaction.shippingAddress.city}, ${transaction.shippingAddress.state} ${transaction.shippingAddress.postalCode}
${transaction.shippingAddress.country}
` : ''}

What's Next?
- You will receive a shipping confirmation email once your order is dispatched
- Track your order using the order ID: ${transaction.orderId}
- If you have any questions, contact our support team

Thank you for shopping with QuickShop!
  `.trim();
}

module.exports = router; 