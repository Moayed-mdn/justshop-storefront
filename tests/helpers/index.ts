/**
 * Test Helpers Index
 * 
 * Central export for all test helper functions.
 * Import from here for convenience: import { loginViaAPI, addToCartViaAPI, searchViaHeader } from '../helpers';
 * 
 * Based on actual JustShop Frontend implementation features.
 */

// Auth helpers
export * from './auth';

// Cart helpers
export * from './cart';

// Search helpers (GraphQL Apollo Client search)
export * from './search';

// Orders helpers
export * from './orders';

// Profile helpers
export * from './profile';

// Types
export * from './types';

// API mock helpers (Playwright route interception)
export * from './mocks';
