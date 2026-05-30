// Assumes a global ApiResponse<T> type. For now, it's defined locally.
// It might be beneficial to move this to a central file like `types/api.ts`.
interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

/**
 * Represents the authenticated user object. It is derived from the backend's `UserResource`.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  has_password: boolean;
  has_google_linked: boolean;
  email_verified_at: string | null; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
}

/**
 * This is the response type for successful login, registration, and "me" endpoints.
 */
export type AuthResponse = ApiResponse<{
  user: AuthUser;
  token?: string | null;
}>;

/**
 * This is the response type for the `/api/v1/users/auth/me` endpoint.
 */
export type UserResponse = ApiResponse<AuthUser>;

/**
 * A generic response for actions like logout, password reset, email verification, etc.
 */
export type AuthActionResponse = ApiResponse<null>;
