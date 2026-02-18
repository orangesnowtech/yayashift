/**
 * Environment Variables Checker
 * Run this script to verify all required environment variables are set
 * Usage: node check-env.js
 */

const requiredEnvVars = [
  // Firebase Client
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  
  // Firebase Admin
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  
  // Zeptomail
  'ZEPTOMAIL_API_KEY',
  'ZEPTOMAIL_FROM_EMAIL',
  'ZEPTOMAIL_FROM_NAME',
  
  // Admin
  'ADMIN_PASSWORD',
];

console.log('\n🔍 Checking Environment Variables...\n');

let allSet = true;
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value !== '' && !value.includes('your_') && !value.includes('_here');
  
  if (isSet) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`❌ ${varName} - MISSING or not configured`);
    allSet = false;
    missingVars.push(varName);
  }
});

console.log('\n' + '='.repeat(60) + '\n');

if (allSet) {
  console.log('🎉 SUCCESS! All environment variables are configured.\n');
  console.log('You can now run: npm run dev\n');
} else {
  console.log('⚠️  INCOMPLETE! Please configure the following variables:\n');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nEdit your .env.local file and add the missing values.');
  console.log('See SETUP_GUIDE.md for detailed instructions.\n');
}

console.log('='.repeat(60) + '\n');
