/**
 * User Test Fixtures
 * 
 * Mock user data for E2E testing.
 * These should match the structure of actual API responses.
 */

import type { User, TestUser } from '../helpers/types';

/**
 * Test user credentials
 * NOTE: These should be set in environment variables for security
 */
export const testUserCredentials: TestUser = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'Password123!',
  name: 'Test User',
  phone: '+1234567890',
};

/**
 * Admin test user
 */
export const adminUserCredentials: TestUser = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!',
  name: 'Admin User',
};

/**
 * Guest user (no authentication)
 */
export const guestUser: TestUser = {
  email: 'guest@example.com',
  password: 'GuestPass123!',
  name: 'Guest User',
};

/**
 * Mock authenticated user data (API response structure)
 */
export const mockAuthenticatedUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  phone: '+1234567890',
  avatar: '/images/avatars/default.jpg',
  email_verified_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock user without email verification
 */
export const unverifiedUser: User = {
  id: 2,
  email: 'unverified@example.com',
  name: 'Unverified User',
  email_verified_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * New user registration data
 */
export const newUserRegistration = {
  email: `test-${Date.now()}@example.com`,
  password: 'NewUserPass123!',
  password_confirmation: 'NewUserPass123!',
  name: 'New Test User',
  phone: '+1234567891',
};

/**
 * Invalid registration data (for validation testing)
 */
export const invalidRegistrations = [
  {
    name: 'Invalid email',
    data: {
      email: 'invalid-email',
      password: 'Password123!',
      password_confirmation: 'Password123!',
      name: 'Test User',
    },
    expectedError: /invalid email/i,
  },
  {
    name: 'Short password',
    data: {
      email: 'test@example.com',
      password: '123',
      password_confirmation: '123',
      name: 'Test User',
    },
    expectedError: /password.*short|minimum.*characters/i,
  },
  {
    name: 'Password mismatch',
    data: {
      email: 'test@example.com',
      password: 'Password123!',
      password_confirmation: 'DifferentPass123!',
      name: 'Test User',
    },
    expectedError: /password.*match|confirmation/i,
  },
  {
    name: 'Missing name',
    data: {
      email: 'test@example.com',
      password: 'Password123!',
      password_confirmation: 'Password123!',
      name: '',
    },
    expectedError: /name.*required/i,
  },
];

/**
 * Generate unique test user
 */
export function generateTestUser(): TestUser {
  const timestamp = Date.now();
  return {
    email: `test-${timestamp}@example.com`,
    password: 'TestPass123!',
    name: `Test User ${timestamp}`,
    phone: `+1${timestamp.toString().slice(-10)}`,
  };
}

/**
 * Generate multiple test users
 */
export function generateTestUsers(count: number): TestUser[] {
  return Array.from({ length: count }, (_, i) => {
    const timestamp = Date.now() + i;
    return {
      email: `test-${timestamp}@example.com`,
      password: 'TestPass123!',
      name: `Test User ${timestamp}`,
      phone: `+1${timestamp.toString().slice(-10)}`,
    };
  });
}
