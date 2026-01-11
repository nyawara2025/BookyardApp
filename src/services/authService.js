// Authentication Service for Bookyard Academy Parent App
// Integrates with n8n webhooks for parent authentication

import apiClient, { 
  loginParent, 
  getStoredUser, 
  clearAuthData, 
  STORAGE_KEYS 
} from '../utils/apiClient';

const TOKEN_EXPIRY_DAYS = 7;

/**
 * Get stored auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get stored authenticated user
 */
export const getAuthUser = () => {
  const user = getStoredUser();
  if (!user) return null;
  
  const token = getAuthToken();
  if (!token) {
    logout();
    return null;
  }
  
  // Check if token is expired
  const storedExpiry = localStorage.getItem(`${STORAGE_KEYS.AUTH_TOKEN}_expiry`);
  if (storedExpiry && Date.now() > parseInt(storedExpiry)) {
    logout();
    return null;
  }
  
  return user;
};

/**
 * Login parent user via n8n webhook
 * @param {string} email - Parent email
 * @param {string} password - Parent password
 * @returns {Promise<{user: object, token: string}>}
 */
export const login = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Call the API
  const { user, token } = await loginParent(email, password);
  
  // Store token with expiry
  const expiry = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(`${STORAGE_KEYS.AUTH_TOKEN}_expiry`, expiry.toString());
  
  return { user, token };
};

/**
 * Logout user
 */
export const logout = () => {
  clearAuthData();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getStoredUser();
  return !!(token && user);
};

/**
 * Refresh token expiry
 */
export const refreshToken = async () => {
  const user = getStoredUser();
  if (!user) {
    throw new Error('No active session');
  }
  
  const expiry = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(`${STORAGE_KEYS.AUTH_TOKEN}_expiry`, expiry.toString());
  
  return true;
};

export default {
  getAuthToken,
  getAuthUser,
  login,
  logout,
  isAuthenticated,
  refreshToken
};
