// API Client Utility for Bookyard Academy
// Handles all HTTP requests to n8n webhooks

import { API_ENDPOINTS } from '../config/apiConfig';

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'bookyard_current_user',
  AUTH_TOKEN: 'bookyard_auth_token',
  PARENT_ID: 'bookyard_parent_id',
};

/**
 * Generic API request handler
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} - Parsed JSON response
 */
const apiRequest = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add timeout for slow connections
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

/**
 * Login parent user via n8n webhook
 * @param {string} email - Parent email
 * @param {string} password - Parent password
 * @returns {Promise<object>} - User data and auth token
 */
export const loginParent = async (email, password) => {
  const response = await apiRequest(API_ENDPOINTS.parentLogin, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Validate response structure
  if (!response || !response.id) {
    throw new Error('Invalid response from server');
  }

  // Store auth data
  const userData = {
    id: response.id,
    first_name: response.first_name,
    last_name: response.last_name,
    email: response.email,
    phone: response.phone,
    studentCode: response.studentCode,
  };

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  localStorage.setItem(STORAGE_KEYS.PARENT_ID, response.id);

  return { user: userData, token: response.token || 'api_token' };
};

/**
 * Get student fees for the logged-in parent
 * @param {string} parentId - The parent's UUID
 * @returns {Promise<array>} - Array of student fee data
 */
export const getStudentFees = async (parentId) => {
  const response = await apiRequest(API_ENDPOINTS.getStudentFees, {
    method: 'POST',
    body: JSON.stringify({ id: parentId }),
  });

  // Handle different response formats
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response.students) {
    return response.students;
  }
  
  if (response.data) {
    return response.data;
  }

  return [];
};

/**
 * Get transaction history for the logged-in parent
 * @param {string} parentId - The parent's UUID
 * @returns {Promise<array>} - Array of transaction records
 */
export const getTransactionHistory = async (parentId) => {
  const response = await apiRequest(API_ENDPOINTS.getTransactionHistory, {
    method: 'POST',
    body: JSON.stringify({ parent_id: parentId }),
  });

  // Handle different response formats
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response.transactions) {
    return response.transactions;
  }
  
  if (response.data) {
    return response.data;
  }

  return [];
};

/**
 * Process a payment
 * @param {object} paymentData - Payment details
 * @returns {Promise<object>} - Transaction result
 */
export const processPayment = async (paymentData) => {
  const response = await apiRequest(API_ENDPOINTS.processPayment, {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

  return response;
};

/**
 * Get the stored parent ID
 * @returns {string|null} - Parent UUID or null
 */
export const getStoredParentId = () => {
  return localStorage.getItem(STORAGE_KEYS.PARENT_ID);
};

/**
 * Get the stored current user
 * @returns {object|null} - User object or null
 */
export const getStoredUser = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.PARENT_ID);
};

export default {
  apiRequest,
  loginParent,
  getStudentFees,
  getTransactionHistory,
  processPayment,
  getStoredParentId,
  getStoredUser,
  clearAuthData,
  STORAGE_KEYS,
};
