// API Configuration for Bookyard Academy
// This file centralizes all API endpoint configurations

// Get the base URL from environment variable or use a default for development
// In production, set VITE_N8N_WEBHOOK_URL in your .env file
const getBaseUrl = () => {
  // Your n8n instance base URL
  return 'https://n8n.tenear.com/webhook';
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  parentLogin: `${getBaseUrl()}/parent-login`,
  
  // Fee Operations
  getStudentFees: `${getBaseUrl()}/student-fees`,
  getTransactionHistory: `${getBaseUrl()}/transaction-history`,
  processPayment: `${getBaseUrl()}/process-payment`,
};

// Webhook paths (for reference)
export const WEBHOOK_PATHS = {
  parentLogin: 'parent-login',
  getStudentFees: 'student-fees',
  getTransactionHistory: 'transaction-history',
  processPayment: 'process-payment',
};

export default {
  API_ENDPOINTS,
  WEBHOOK_PATHS,
  getBaseUrl
};
