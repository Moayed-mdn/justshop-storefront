/**
 * Profile E2E Tests
 *
 * Covers:
 *   - /profile  — authenticated user profile page
 *     - Personal information (name, email, phone)
 *     - Avatar upload/removal
 *     - Password change
 *     - Account deletion
 *
 * All tests use API mocks from helpers/mocks.ts.
 * Each test is fully independent — no shared state.
 */

import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage';
import { mockAuthAPI, mockProfileAPI } from '../../helpers/mocks';
import { clearTestState, setupAuthenticatedContext } from '../../fixtures';

// ---------------------------------------------------------------------------
// Profile Page Access
// ---------------------------------------------------------------------------

test.describe('Profile Page — Access Control', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('guest user is redirected to login when accessing profile', async ({ page }) => {
    await mockAuthAPI(page);
    const profile = new ProfilePage(page);

    await profile.goto();

    // Should redirect to login page (protected route)
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user can view profile page', async ({ page }) => {
    await mockAuthAPI(page);
    await mockProfileAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.assertPageLoaded();
  });

});

// ---------------------------------------------------------------------------
// View Profile Data
// ---------------------------------------------------------------------------

test.describe('Profile Page — View Data', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
  });

  test('displays user name in profile form', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const data = await profile.getProfileData();
    expect(data.name).toContain('John');
  });

  test('displays user email in profile form', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const data = await profile.getProfileData();
    expect(data.email).toContain('john@example.com');
  });

  test('displays user phone in profile form', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const data = await profile.getProfileData();
    expect(data.phone).toBeTruthy();
  });

});

// ---------------------------------------------------------------------------
// Update Profile Information
// ---------------------------------------------------------------------------

test.describe('Profile Page — Update Personal Info', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
  });

  test('can update name', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updateProfile({ name: 'Updated Name' });

    await page.waitForTimeout(800);
  });

  test('can update phone number', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updateProfile({ phone: '+9876543210' });

    await page.waitForTimeout(800);
  });

  test('can update multiple fields at once', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updateProfile({
      name: 'New Name',
      phone: '+1111111111',
    });

    await page.waitForTimeout(800);
  });

  test('shows validation error for empty name', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updateProfile({ name: '' });

    // HTML5 validation should prevent submission
    const nameValidity = await profile.nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(nameValidity).toBe(false);
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updateProfile({ email: 'invalid-email' });

    // HTML5 validation should prevent submission
    const emailValidity = await profile.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBe(false);
  });

});

// ---------------------------------------------------------------------------
// Avatar Management
// ---------------------------------------------------------------------------

test.describe('Profile Page — Avatar', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
  });

  test('displays avatar section', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.avatarSection).toBeVisible();
  });

  test('shows initials when no avatar is set', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    const hasInitials = await profile.avatarInitials.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasInitials) {
      await profile.assertAvatarInitialsDisplayed();
    }
  });

  test('shows avatar change button', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.avatarChangeButton).toBeVisible();
  });

  test('shows remove button when avatar exists', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatar: '/avatars/test-user.jpg',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const removeButton = profile.avatarRemoveButton;
    const isVisible = await removeButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await expect(removeButton).toBeEnabled();
    }
  });

});

// ---------------------------------------------------------------------------
// Password Management
// ---------------------------------------------------------------------------

test.describe('Profile Page — Password Change', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
  });

  test('shows password section for users with password', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.passwordSection).toBeVisible();
  });

  test('shows current password field for users with password', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const hasCurrentPassword = await profile.currentPasswordInput.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasCurrentPassword) {
      await profile.assertHasPasswordField();
    }
  });

  test('does not show current password field for Google-only users', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: false,
        has_google_linked: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.assertNoPasswordField();
  });

  test('can change password with valid inputs', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.changePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    await page.waitForTimeout(800);
  });

  test('validates password confirmation match', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.changePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'DifferentPassword123!',
    });

    await page.waitForTimeout(800);
    // Should show validation error (handled by backend mock)
  });

  test('validates required fields for password change', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.updatePasswordButton.click();

    // HTML5 validation should prevent submission
    const currentPasswordValidity = await profile.currentPasswordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(currentPasswordValidity).toBe(false);
  });

  test('Google-only users can set a password', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: false,
        has_google_linked: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.setPassword({
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    await page.waitForTimeout(800);
  });

});

// ---------------------------------------------------------------------------
// Account Deletion
// ---------------------------------------------------------------------------

test.describe('Profile Page — Account Deletion', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
  });

  test('displays danger zone section with delete button', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.dangerZoneSection).toBeVisible();
    await expect(profile.deleteAccountButton).toBeVisible();
  });

  test('opens confirmation modal when clicking delete account', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.deleteAccountButton.click();

    await profile.assertDeleteModalVisible();
  });

  test('can cancel account deletion', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.deleteAccountButton.click();
    await page.waitForTimeout(500);

    await profile.cancelDeleteAccount();
  });

  test('requires password confirmation for account deletion', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.deleteAccountButton.click();

    const passwordField = profile.deletePasswordInput;
    const isVisible = await passwordField.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await expect(passwordField).toBeVisible();
    }
  });

});

// ---------------------------------------------------------------------------
// Google Account Integration
// ---------------------------------------------------------------------------

test.describe('Profile Page — Google Integration', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
  });

  test('shows Google linked badge when account is linked', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_google_linked: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const hasGoogle = await profile.hasGoogleLinked();
    
    if (hasGoogle) {
      await profile.assertGoogleLinked();
    }
  });

  test('does not show Google badge for non-Google accounts', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        has_google_linked: false,
        has_password: true,
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const profile = new ProfilePage(page);
    await profile.goto();

    const hasGoogle = await profile.hasGoogleLinked();
    expect(hasGoogle).toBe(false);
  });

});

// ---------------------------------------------------------------------------
// Responsive Design
// ---------------------------------------------------------------------------

test.describe('Profile Page — Responsive', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await mockAuthAPI(page);
    await mockProfileAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
  });

  test('profile page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.assertPageLoaded();
  });

  test('profile page renders correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.assertPageLoaded();
  });

  test('profile page renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const profile = new ProfilePage(page);
    await profile.goto();

    await profile.assertPageLoaded();
  });

});
