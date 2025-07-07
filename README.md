# QuickShop: Simple E-commerce Cart with Payments

A full-stack e-commerce application built with React and Node.js, featuring Stripe payment integration, email confirmations, and a modern user interface.

## 🚀 Features

- **Product Listing**: Browse through a curated selection of products
- **Shopping Cart**: Add, remove, and update item quantities
- **Cart Persistence**: Cart items persist across browser sessions
- **Stripe Payment Integration**: Secure payment processing with test mode
- **Email Confirmations**: Automated order confirmation emails
- **Transaction Logging**: Complete transaction history and logging
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant cart updates and notifications

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Stripe React Elements** - Secure payment forms
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Modern styling with flexbox and grid

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Stripe API** - Payment processing
- **Nodemailer** - Email sending
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 16+ and npm
- A Stripe account (free test account works)
- Basic knowledge of React and Node.js

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quickshop-ecommerce
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm run install-all
```

Or manually:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment Setup

#### Server Environment Variables
Create a `.env` file in the `server` directory:

```env
PORT=5000

# Stripe Configuration (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration (Using Ethereal Email for testing)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_username
EMAIL_PASS=your_ethereal_password
EMAIL_FROM=noreply@quickshop.com

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### Client Environment Variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Getting Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a free account or sign in
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable key** and **Secret key** (use test keys)
5. Add them to your environment files

### 5. Setting Up Email (Optional but Recommended)

For email testing, you can use [Ethereal Email](https://ethereal.email/):

1. Go to [Ethereal Email](https://ethereal.email/)
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials
4. Add them to your server `.env` file

Alternatively, you can use:
- **Gmail SMTP** (requires app password)
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
# Run both client and server concurrently
npm run dev
```

This will start:
- **Server**: http://localhost:5000
- **Client**: http://localhost:3000

### Manual Start
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

### Production Build
```bash
# Build the client for production
npm run build
```

## 🧪 Testing the Application

### Test Payment Information
Use these test card details for Stripe payments:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3-digit number (e.g., `123`)
- **ZIP**: Any 5-digit number (e.g., `12345`)

### Testing Email
If using Ethereal Email, check your test emails at: https://ethereal.email/messages

## 📁 Project Structure

```
quickshop-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Cart state)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── index.js        # App entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/              # Mock data and logs
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
├── package.json           # Root package.json
└── README.md
```

## 🔗 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart/:sessionId/add` - Add item to cart
- `PUT /api/cart/:sessionId/update/:productId` - Update quantity
- `DELETE /api/cart/:sessionId/remove/:productId` - Remove item
- `DELETE /api/cart/:sessionId/clear` - Clear cart

### Payment
- `GET /api/payment/config` - Get Stripe config
- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `GET /api/payment/transaction/:id` - Get transaction

### Email
- `POST /api/email/send-confirmation` - Send order confirmation
- `POST /api/email/test` - Test email configuration

## 🛡 Security Features

- **Stripe Security**: PCI-compliant payment processing
- **Environment Variables**: Sensitive data protected
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Server-side validation
- **Error Handling**: Comprehensive error management

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design
- **Loading States**: Visual feedback for all actions
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Accessible Forms**: Proper labeling and validation

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to server"
- Check if the server is running on port 5000
- Verify the `REACT_APP_API_URL` in client `.env`

#### "Stripe publishable key not found"
- Check your Stripe API keys in both `.env` files
- Ensure you're using test keys (starting with `pk_test_` and `sk_test_`)

#### "Email not sending"
- Verify your email credentials in server `.env`
- Check Ethereal Email inbox at https://ethereal.email/messages

#### "Payment failing"
- Use test card number: `4242 4242 4242 4242`
- Check browser console for detailed error messages
- Verify Stripe secret key is correctly set

### Logs and Debugging
- Server logs: Check terminal running the server
- Client logs: Check browser developer console
- Transaction logs: Stored in `server/data/transactions.json`

## 📝 Customization

### Adding New Products
Edit `server/data/products.json` to add/modify products.

### Styling
Modify `client/src/index.css` for custom styling.

### Payment Options
Configure additional payment methods in the Stripe dashboard.

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku config
3. Deploy using Heroku CLI or GitHub integration

### Vercel/Netlify (Frontend only)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder
3. Configure environment variables

## 🖼 Screenshots

| Home | Cart | Checkout |
|------|------|----------|
| ![Home](assets/home.png) | ![Cart](assets/cart.png) | ![Checkout](assets/checkout.png) |

> Place your own screenshots in the `assets/` folder with the same filenames.

### Netlify + Render (Full-stack Deployment)

1. **Backend (Render)**
   1. Sign in to Render and create a **Web Service**.
   2. Select this repository and set the root directory to `server`.
   3. Build command: `npm install`
   4. Start command: `npm start`
   5. Add the same environment variables from your local `.env`.
   6. Deploy – Render will provide a backend URL, e.g. `https://quickshop-api.onrender.com`.
2. **Frontend (Netlify)**
   1. Sign in to Netlify → **New site from Git** → choose this repo.
   2. Build command: `cd client && npm run build`
   3. Publish directory: `client/build`
   4. Add env var `REACT_APP_API_URL` with the Render backend URL followed by `/api`.
   5. Deploy – Netlify gives you a public site URL, e.g. `https://quickshop.netlify.app`.
3. **Update CORS & CLIENT_URL**
   • Ensure `CLIENT_URL` in the Render backend env matches the Netlify URL so CORS works.

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review server and client logs
3. Ensure all environment variables are set correctly
4. Verify your Stripe test keys are active

## 📄 License

This project is licensed under the MIT License.

---

**Happy Shopping with QuickShop! 🛒** 