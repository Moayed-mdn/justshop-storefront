// Assumes a global ApiResponse<T> type like:
// interface ApiResponse<T> {
//   success: true;
//   data: T;
//   message: string;
// }

import type { ApiSuccess } from "./api";

/**
 * Represents the user's profile data, derived from the backend's ProfileResource.
 */
export interface Profile {
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
 * This is the main response type for profile-related API calls.
 * It uses a generic ApiResponse type.
 */
export type ProfileResponse = ApiSuccess<Profile>;

/**
 * The endpoint for updating the user's avatar returns a specific response
 * containing the new avatar URL.
 */
export type UpdateAvatarResponse = ApiSuccess<{
  avatar: string;
}>;
