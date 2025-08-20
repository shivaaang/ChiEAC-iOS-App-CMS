//
//  scripts/manage-email-config.js
//  ChiEAC Firebase Functions
//
//  Script to manage email notification configuration using environment variables
//  Created by Shivaang Kumar on 8/20/25.
//

import { execSync } from 'child_process';

// Suppress deprecation warnings
process.env.NODE_OPTIONS = '--no-deprecation';

class EmailConfigManager {
  static getCurrentRecipient() {
    try {
      // Check environment variable first
      const envValue = process.env.NOTIFICATION_RECIPIENT;
      if (envValue) {
        return envValue;
      }
      return 'Not set (will use default: shivaang.05@gmail.com)';
    } catch (error) {
      return 'Not set (will use default: shivaang.05@gmail.com)';
    }
  }

  static setRecipient(email) {
    try {
      console.log(`🔧 Setting notification recipient to: ${email}`);
      console.log('\n💡 For modern Firebase Functions, you have two options:');
      console.log('\n1. Set as environment variable for deployment:');
      console.log(`   export NOTIFICATION_RECIPIENT="${email}"`);
      console.log('   firebase deploy --only functions');
      console.log('\n2. Set using Firebase CLI (will be deprecated in 2026):');
      execSync(`firebase functions:config:set notification.recipient="${email}"`, { 
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--no-deprecation' }
      });
      console.log('\n✅ Email recipient updated successfully!');
      console.log('\n📝 Note: Changes will take effect on next function deployment.');
      console.log('Run: npm run deploy');
    } catch (error) {
      console.error('❌ Failed to set email recipient:', error.message);
    }
  }

  static showHelp() {
    console.log('📧 ChiEAC Email Configuration Manager\n');
    console.log('Usage:');
    console.log('  node scripts/manage-email-config.js current          # Show current recipient');
    console.log('  node scripts/manage-email-config.js set <email>      # Set new recipient');
    console.log('  node scripts/manage-email-config.js help             # Show this help');
    console.log('\nExamples:');
    console.log('  node scripts/manage-email-config.js set admin@chieac.org');
    console.log('  node scripts/manage-email-config.js set team@example.com');
    console.log('\nModern approach (recommended):');
    console.log('  export NOTIFICATION_RECIPIENT="admin@chieac.org"');
    console.log('  firebase deploy --only functions');
  }
}

// Parse command line arguments
const [,, command, email] = process.argv;

switch (command) {
  case 'current':
    console.log('Current notification recipient:', EmailConfigManager.getCurrentRecipient());
    break;
  
  case 'set':
    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: node scripts/manage-email-config.js set <email>');
      process.exit(1);
    }
    if (!email.includes('@')) {
      console.error('❌ Please provide a valid email address');
      process.exit(1);
    }
    EmailConfigManager.setRecipient(email);
    break;
  
  case 'help':
  default:
    EmailConfigManager.showHelp();
    break;
}
