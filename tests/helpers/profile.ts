/**
 * Profile Testing Helpers
 * 
 * Utilities for user profile testing in JustShop Frontend.
 * Based on actual profile implementation:
 * - Profile page (pages/profile/index.vue or similar)
 * - Profile edit/update functionality
 * - Avatar upload
 * - Password change
 * - Account deletion
 */

import { Page, expect } from '@playwright/test';

/**
 * Navigate to profile page
 */
export async function goToProfile(page: Page): Promise<void> {
  await page.goto('/profile');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to profile edit page (if separate)
 */
export async function goToEditProfile(page: Page): Promise<void> {
  await page.goto('/profile/edit');
  await page.waitForLoadState('networkidle');
}

/**
 * Get profile data
 */
export async function getProfileData(page: Page): Promise<{
  name: string;
  email: string;
  phone?: string;
}> {
  const nameElement = page.locator('[data-profile-name], [name="name"]').first();
  const emailElement = page.locator('[data-profile-email], [name="email"]').first();
  const phoneElement = page.locator('[data-profile-phone], [name="phone"]').first();
  
  const name = await nameElement.inputValue().catch(() => nameElement.textContent());
  const email = await emailElement.inputValue().catch(() => emailElement.textContent());
  const phone = await phoneElement.inputValue().catch(() => phoneElement.textContent()).catch(() => undefined);
  
  return {
    name: name?.trim() || '',
    email: email?.trim() || '',
    phone: phone?.trim(),
  };
}

/**
 * Update profile information
 */
export async function updateProfile(
  page: Page,
  data: {
    name?: string;
    email?: string;
    phone?: string;
  }
): Promise<void> {
  if (data.name) {
    await page.fill('[name="name"], input[placeholder*="name"]', data.name);
  }
  
  if (data.email) {
    await page.fill('[name="email"], input[type="email"]', data.email);
  }
  
  if (data.phone) {
    await page.fill('[name="phone"], input[placeholder*="phone"]', data.phone);
  }
  
  // Submit form
  const submitButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Update")').first();
  await submitButton.click();
  
  await page.waitForLoadState('networkidle');
}

/**
 * Upload avatar/profile picture
 */
export async function uploadAvatar(
  page: Page,
  filePath: string
): Promise<void> {
  // Find file input for avatar
  const fileInput = page.locator('input[type="file"][name="avatar"], input[type="file"][accept*="image"]').first();
  
  await fileInput.setInputFiles(filePath);
  
  // Wait for upload to complete (may have save button or auto-upload)
  const saveButton = page.locator('button:has-text("Save"), button:has-text("Upload")').first();
  
  if (await saveButton.isVisible({ timeout: 2000 })) {
    await saveButton.click();
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Remove avatar
 */
export async function removeAvatar(page: Page): Promise<void> {
  const removeButton = page.locator('[data-action="remove-avatar"], button:has-text("Remove")').first();
  await removeButton.click();
  
  // Confirm if there's a confirmation dialog
  const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
  
  if (await confirmButton.isVisible({ timeout: 2000 })) {
    await confirmButton.click();
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Change password
 */
export async function changePassword(
  page: Page,
  currentPassword: string,
  newPassword: string,
  confirmPassword?: string
): Promise<void> {
  // Navigate to change password section (might be on same page or separate)
  const changePasswordSection = page.locator('[data-section="change-password"], [id="change-password"]').first();
  
  if (await changePasswordSection.isVisible({ timeout: 1000 }).catch(() => false)) {
    // Already on the page, scroll to section
    await changePasswordSection.scrollIntoViewIfNeeded();
  } else {
    // Try to navigate to change password page
    const changePasswordLink = page.locator('a:has-text("Change Password"), a[href*="password"]').first();
    if (await changePasswordLink.isVisible({ timeout: 1000 }).catch(() => false)) {
      await changePasswordLink.click();
      await page.waitForLoadState('networkidle');
    }
  }
  
  // Fill password form
  await page.fill('[name="current_password"], input[placeholder*="Current"]', currentPassword);
  await page.fill('[name="password"], [name="new_password"]', newPassword);
  await page.fill('[name="password_confirmation"], [name="confirm_password"]', confirmPassword || newPassword);
  
  // Submit
  const submitButton = page.locator('button[type="submit"]:has-text("Change"), button:has-text("Update")').first();
  await submitButton.click();
  
  await page.waitForLoadState('networkidle');
}

/**
 * Delete account
 */
export async function deleteAccount(
  page: Page,
  password: string
): Promise<void> {
  // Find delete account button
  const deleteButton = page.locator('[data-action="delete-account"], button:has-text("Delete Account")').first();
  await deleteButton.click();
  
  // Fill password confirmation (usually in a modal)
  const passwordInput = page.locator('[name="password"], input[type="password"]').last();
  await passwordInput.fill(password);
  
  // Confirm deletion
  const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
  await confirmButton.click();
  
  // Wait for redirect (usually to home or logout)
  await page.waitForURL(/\/(login|$)/);
}

/**
 * View avatar
 */
export async function getAvatarUrl(page: Page): Promise<string | null> {
  const avatar = page.locator('[data-profile-avatar], img[alt*="avatar"], img[alt*="profile"]').first();
  return await avatar.getAttribute('src');
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(page: Page): Promise<boolean> {
  const verifiedBadge = page.locator('[data-email-verified], text=/verified/i').first();
  return await verifiedBadge.isVisible().catch(() => false);
}

/**
 * Resend email verification
 */
export async function resendEmailVerification(page: Page): Promise<void> {
  const resendButton = page.locator('button:has-text("Resend"), button:has-text("Verify")').first();
  await resendButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to orders from profile
 */
export async function goToOrdersFromProfile(page: Page): Promise<void> {
  const ordersLink = page.locator('a:has-text("Orders"), a[href*="orders"]').first();
  await ordersLink.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to addresses from profile
 */
export async function goToAddressesFromProfile(page: Page): Promise<void> {
  const addressesLink = page.locator('a:has-text("Addresses"), a[href*="addresses"]').first();
  await addressesLink.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Logout from profile page
 */
export async function logoutFromProfile(page: Page): Promise<void> {
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")').first();
  await logoutButton.click();
  await page.waitForURL(/\/(login|$)/);
}

/**
 * Wait for profile update success
 */
export async function waitForProfileUpdateSuccess(page: Page, timeout = 5000): Promise<void> {
  // Look for success message
  const successMessage = page.locator('[role="status"], text=/updated|saved successfully/i').first();
  await successMessage.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for password change success
 */
export async function waitForPasswordChangeSuccess(page: Page, timeout = 5000): Promise<void> {
  const successMessage = page.locator('[role="status"], text=/password.*changed|password.*updated/i').first();
  await successMessage.waitFor({ state: 'visible', timeout });
}

/**
 * Assert profile page is loaded
 */
export async function assertProfilePageLoaded(page: Page): Promise<void> {
  // Check for profile-specific elements
  const profileHeading = page.locator('h1:has-text("Profile"), h1:has-text("Account")').first();
  await expect(profileHeading).toBeVisible();
}

/**
 * Assert profile data matches
 */
export async function assertProfileData(
  page: Page,
  expectedData: {
    name?: string;
    email?: string;
    phone?: string;
  }
): Promise<void> {
  const actualData = await getProfileData(page);
  
  if (expectedData.name) {
    expect(actualData.name).toBe(expectedData.name);
  }
  
  if (expectedData.email) {
    expect(actualData.email).toBe(expectedData.email);
  }
  
  if (expectedData.phone) {
    expect(actualData.phone).toBe(expectedData.phone);
  }
}

/**
 * Assert profile update succeeded
 */
export async function assertProfileUpdated(page: Page): Promise<void> {
  const successMessage = page.locator('[role="status"], text=/updated|saved successfully/i').first();
  await expect(successMessage).toBeVisible();
}

/**
 * Assert profile update failed
 */
export async function assertProfileUpdateFailed(page: Page, errorText?: string): Promise<void> {
  const errorMessage = page.locator('[role="alert"], [class*="error"]').first();
  await expect(errorMessage).toBeVisible();
  
  if (errorText) {
    await expect(errorMessage).toContainText(errorText);
  }
}

/**
 * Assert avatar is displayed
 */
export async function assertAvatarDisplayed(page: Page): Promise<void> {
  const avatar = page.locator('[data-profile-avatar], img[alt*="avatar"]').first();
  await expect(avatar).toBeVisible();
  
  const src = await avatar.getAttribute('src');
  expect(src).toBeTruthy();
  expect(src).not.toContain('default'); // Not default avatar
}

/**
 * Assert password change succeeded
 */
export async function assertPasswordChanged(page: Page): Promise<void> {
  const successMessage = page.locator('[role="status"], text=/password.*changed|password.*updated/i').first();
  await expect(successMessage).toBeVisible();
}

/**
 * Assert password change failed
 */
export async function assertPasswordChangeFailed(page: Page, errorText?: string): Promise<void> {
  const errorMessage = page.locator('[role="alert"], text=/incorrect|invalid/i').first();
  await expect(errorMessage).toBeVisible();
  
  if (errorText) {
    await expect(errorMessage).toContainText(errorText);
  }
}

/**
 * Assert email is verified
 */
export async function assertEmailVerified(page: Page): Promise<void> {
  const isVerified = await isEmailVerified(page);
  expect(isVerified).toBe(true);
}

/**
 * Assert email is NOT verified
 */
export async function assertEmailNotVerified(page: Page): Promise<void> {
  const notVerifiedMessage = page.locator('text=/not verified|verify.*email/i').first();
  await expect(notVerifiedMessage).toBeVisible();
}
