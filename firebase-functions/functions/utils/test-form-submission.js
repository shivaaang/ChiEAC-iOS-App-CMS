#!/usr/bin/env node

// Test script to create a form submission document and trigger our email function
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp();
const db = getFirestore(app);

async function createTestSubmission() {
  try {
    console.log('Creating test form submission...');
    
    const testData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      message: 'This is a test form submission to verify email notifications',
      phone: '555-123-4567',
      source: 'test',
      status: 'incomplete',
      submittedAt: new Date()
    };

    const docRef = await db.collection('contact_form_submissions').add(testData);
    console.log('Test submission created with ID:', docRef.id);
    console.log('This should trigger the onFormSubmissionCreated function');
    
    // Wait a moment for the function to process
    setTimeout(() => {
      console.log('Check your email and Firebase function logs for results');
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('Error creating test submission:', error);
    process.exit(1);
  }
}

createTestSubmission();
