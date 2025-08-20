#!/usr/bin/env node
//
//  refresh-oauth-completely.js
//  Complete OAuth refresh with service account approach
//

import { google } from 'googleapis';
import readline from 'readline';

// const CLIENT_ID = 'YOUR_GMAIL_CLIENT_ID_HERE';
// const CLIENT_SECRET = 'YOUR_GMAIL_CLIENT_SECRET_HERE';

// Comprehensive Gmail scopes for sending emails
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent', // Force fresh consent
  include_granted_scopes: true
});

console.log('🔄 Complete OAuth Refresh for Gmail Integration');
console.log('===============================================');
console.log('\n🚨 Gmail is rejecting our current token. Let\'s get a fresh one.');
console.log('\n📋 This will authorize with comprehensive Gmail sending permissions.');
console.log('\n1️⃣  Open this URL in your browser:');
console.log('\n' + authUrl);
console.log('\n2️⃣  Sign in as chieac.developer@gmail.com');
console.log('3️⃣  Accept all permissions');
console.log('4️⃣  Copy the authorization code and paste it below');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n🔑 Enter the new authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Fresh authorization successful!');
    console.log('\n📋 Your new refresh token (with full Gmail permissions):');
    console.log(tokens.refresh_token);
    
    console.log('\n🔧 Update the Firebase secret:');
    console.log(`echo "${tokens.refresh_token}" | firebase functions:secrets:set GMAIL_REFRESH_TOKEN`);
    
    // Test the new token immediately
    console.log('\n🧪 Testing the new token...');
    oauth2Client.setCredentials(tokens);
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ Gmail API access confirmed!');
    console.log('📧 Email address:', profile.data.emailAddress);
    console.log('📊 Total messages:', profile.data.messagesTotal);
    
    console.log('\n🎉 This token should work for email sending!');
    
  } catch (error) {
    console.error('❌ Authorization failed:', error.message);
  }
  rl.close();
});
