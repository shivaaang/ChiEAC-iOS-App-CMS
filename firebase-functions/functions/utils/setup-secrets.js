#!/usr/bin/env node

//
//  scripts/setup-secrets.js
//  ChiEAC Firebase Functions
//
//  Script to set up Firebase Secrets without deprecated warnings
//  Created by Shivaang Kumar on 8/20/25.
//

import { execSync } from 'child_process';

// Suppress the punycode deprecation warning
process.env.NODE_OPTIONS = '--no-deprecation';

const secrets = {
  // GMAIL_CLIENT_ID: 'YOUR_GMAIL_CLIENT_ID_HERE',
  // GMAIL_CLIENT_SECRET: 'YOUR_GMAIL_CLIENT_SECRET_HERE', 
  // GMAIL_REFRESH_TOKEN: 'YOUR_GMAIL_REFRESH_TOKEN_HERE',
  // GMAIL_USER_EMAIL: 'your-email@gmail.com'
};

console.log('🔐 Setting up Firebase Secrets (modern approach)...\n');

for (const [secretName, secretValue] of Object.entries(secrets)) {
  try {
    console.log(`Setting ${secretName}...`);
    
    // Use echo to pipe the value to avoid interactive prompts
    execSync(`echo "${secretValue}" | firebase functions:secrets:set ${secretName}`, {
      stdio: ['pipe', 'inherit', 'inherit'],
      env: { ...process.env, NODE_OPTIONS: '--no-deprecation' }
    });
    
    console.log(`✅ ${secretName} set successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to set ${secretName}:`, error.message);
    process.exit(1);
  }
}

console.log('🎉 All secrets configured successfully!');
console.log('\n📝 Next steps:');
console.log('1. Set the notification recipient:');
console.log('   firebase functions:config:set notification.recipient="shivaang.05@gmail.com"');
console.log('2. Deploy your functions:');
console.log('   npm run deploy');
console.log('3. Test the email system by creating a form submission');
