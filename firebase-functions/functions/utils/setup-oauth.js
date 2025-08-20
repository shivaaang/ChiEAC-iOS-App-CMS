#!/usr/bin/env node

// Simple script to run OAuth setup
import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Starting OAuth Setup for ChiEAC Gmail Integration...\n');

try {
  // Build the project first
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Run the OAuth setup
  console.log('\nRunning OAuth setup...');
  execSync('node lib/setup/oauthSetup.js', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
