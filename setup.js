#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Welcome to QuickShop Setup!\n');
console.log('This script will help you configure your environment variables.\n');

const questions = [
  {
    key: 'STRIPE_PUBLISHABLE_KEY',
    question: 'Enter your Stripe Publishable Key (pk_test_...): ',
    required: true
  },
  {
    key: 'STRIPE_SECRET_KEY', 
    question: 'Enter your Stripe Secret Key (sk_test_...): ',
    required: true
  },
  {
    key: 'EMAIL_USER',
    question: 'Enter your email username (optional, press Enter to skip): ',
    required: false
  },
  {
    key: 'EMAIL_PASS',
    question: 'Enter your email password (optional, press Enter to skip): ',
    required: false
  }
];

let answers = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFiles();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(q.question, (answer) => {
    if (q.required && !answer.trim()) {
      console.log('❌ This field is required. Please try again.\n');
      askQuestion();
      return;
    }
    
    answers[q.key] = answer.trim();
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFiles() {
  console.log('\n📝 Creating environment files...\n');

  // Server .env file
  const serverEnvContent = `PORT=5001

# Stripe Configuration
STRIPE_SECRET_KEY=${answers.STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${answers.STRIPE_PUBLISHABLE_KEY}

# Email Configuration (Using Ethereal Email for testing)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=${answers.EMAIL_USER || 'ethereal.user@ethereal.email'}
EMAIL_PASS=${answers.EMAIL_PASS || 'ethereal.pass'}
EMAIL_FROM=noreply@quickshop.com

# Frontend URL
CLIENT_URL=http://localhost:3000
`;

  // Client .env file
  const clientEnvContent = `REACT_APP_STRIPE_PUBLISHABLE_KEY=${answers.STRIPE_PUBLISHABLE_KEY}
REACT_APP_API_URL=http://localhost:5000/api
`;

  try {
    // Create server directory if it doesn't exist
    if (!fs.existsSync('server')) {
      fs.mkdirSync('server');
    }

    // Create client directory if it doesn't exist
    if (!fs.existsSync('client')) {
      fs.mkdirSync('client');
    }

    // Write server .env file
    fs.writeFileSync(path.join('server', '.env'), serverEnvContent);
    console.log('✅ Created server/.env');

    // Write client .env file
    fs.writeFileSync(path.join('client', '.env'), clientEnvContent);
    console.log('✅ Created client/.env');

    console.log('\n🎉 Setup complete! Environment files created successfully.\n');
    console.log('Next steps:');
    console.log('1. Run "npm run install-all" to install dependencies');
    console.log('2. Run "npm run dev" to start the development server');
    console.log('3. Visit http://localhost:3000 to see your app!\n');
    
    if (!answers.EMAIL_USER || !answers.EMAIL_PASS) {
      console.log('💡 For email testing, visit https://ethereal.email/ to get test credentials');
      console.log('   Then update your server/.env file with the credentials.\n');
    }

    console.log('📚 Check README.md for detailed documentation.\n');

  } catch (error) {
    console.error('❌ Error creating environment files:', error.message);
  }

  rl.close();
}

console.log('To get your Stripe API keys:');
console.log('1. Go to https://dashboard.stripe.com/register');
console.log('2. Create a free account or sign in');
console.log('3. Navigate to Developers → API Keys');
console.log('4. Copy your test keys (they start with pk_test_ and sk_test_)\n');

askQuestion(); 