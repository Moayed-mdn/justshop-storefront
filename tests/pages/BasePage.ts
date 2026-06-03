/**
 * Base Page Object Model
 * 
 * Base class for all Page Objects in JustShop Frontend tests.
 * Based on actual project implementation:
 * - Nuxt 4 with Vue 3.5.24
 * - @nuxt/ui component library
 * - StorefrontShell layout structure (app/components/shell/StorefrontShell.vue)
 * - Multi-tenant architecture (X-Tenant-Id header)
 * - i18n support (English default, Arabic with RTL)
 * - Theme support (light/dark via useTheme composable)
 * 
 * Selector Strategy:
 * 1. data-testid (preferred, but currently NONE exist in codebase)
 * 2. data-storefront-* attributes (some exist: data-storefront-shell)
 * 3. Semantic HTML + ARIA (buttons, inputs, nav, header, footer)
 * 4. Class names (use CSS variables patterns: --color-*, --header-*)
 * 5. Text content (as last resort)
 */

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // ═══════════════════════════════════════════════════════════════
  // STOREFRONT SHELL STRUCTURE
  // Based on: app/components/shell/StorefrontShell.vue
  // ═══════════════════════════════════════════════════════════════

  /** Main shell container: data-storefront-shell="root" */
  readonly shellRoot: Locator;

  /** Header container: data-storefront-shell="header" */
  readonly shellHeader: Locator;

  /** Main content area */
  readonly mainContent: Locator;

  /** Footer container */
  readonly footer: Locator;

  // ═══════════════════════════════════════════════════════════════
  // HEADER COMPONENTS
  // Based on: app/components/shell/StorefrontShellHeader.vue
  // ═══════════════════════════════════════════════════════════════

  /** Header logo link */
  readonly logo: Locator;

  /** Search input container */
  readonly searchInput: Locator;

  /** Cart button/link */
  readonly cartButton: Locator;

  /** Cart badge (item count) */
  readonly cartBadge: Locator;

  /** Account/login link (when not authenticated) */
  readonly accountLink: Locator;

  /** Profile dropdown trigger (when authenticated) */
  readonly profileDropdown: Locator;

  /** Theme toggle button */
  readonly themeToggle: Locator;

  /** Burger menu trigger (mobile) */
  readonly burgerMenu: Locator;

  // ═══════════════════════════════════════════════════════════════
  // TOPBAR COMPONENTS (if showTopbar: true)
  // Based on: app/components/Topbar.vue
  // ═══════════════════════════════════════════════════════════════

  /** Topbar container */
  readonly topbar: Locator;

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION
  // Based on: HeaderLinks, HeaderBurger components
  // ═══════════════════════════════════════════════════════════════

  /** Main navigation (desktop) */
  readonly mainNav: Locator;

  /** Mobile burger menu navigation */
  readonly mobileNav: Locator;

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATIONS (@nuxt/ui toaster)
  // Based on: app/app.vue with <UApp :toaster="{ position: 'top-right' }">
  // ═══════════════════════════════════════════════════════════════

  /** Notification/toast container */
  readonly notification: Locator;

  constructor(page: Page) {
    this.page = page;

    // Shell structure
    this.shellRoot = page.locator('[data-storefront-shell="root"]');
    this.shellHeader = page.locator('[data-storefront-shell="header"]');
    this.mainContent = page.locator('main');
    this.footer = page.locator('footer');

    // Header components - using actual patterns from HeaderActions.vue, HeaderLogo.vue
    this.logo = this.shellHeader.locator('a[href="/"], a[href*="home"]').first();
    this.searchInput = this.shellHeader.locator('input[type="search"]');
    
    // Cart - HeaderActions.vue has cart link with image and badge
    this.cartButton = this.shellHeader.locator('a[href*="cart"]');
    this.cartBadge = this.cartButton.locator('div[class*="absolute"]').first(); // Badge position classes
    
    // Account/Profile - HeaderActions.vue shows login link when not authenticated
    this.accountLink = this.shellHeader.locator('a[href*="login"]').first();
    this.profileDropdown = this.shellHeader.locator('[class*="HeaderProfileDropdown"], [data-component="profile-dropdown"]');
    
    // Theme toggle - ThemeToggle.vue component
    this.themeToggle = this.shellHeader.locator('button[aria-label*="theme"], button[class*="ThemeToggle"]').first();
    
    // Burger menu - HeaderActions.vue has burger with id="burger-menu-trigger"
    this.burgerMenu = page.locator('#burger-menu-trigger, button[aria-controls="header-mobile-nav"]');

    // Topbar
    this.topbar = page.locator('[class*="Topbar"], [data-component="topbar"]').first();

    // Navigation
    this.mainNav = this.shellHeader.locator('nav[aria-label*="navigation"]');
    this.mobileNav = page.locator('#header-mobile-nav, [data-mobile-nav]');

    // Notifications (@nuxt/ui uses specific toast structure)
    this.notification = page.locator('[role="alert"], [role="status"], [class*="notification"], [class*="toast"]');
  }

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Navigate to a URL
   * Handles i18n prefix automatically
   */
  async goto(path: string, options?: { locale?: 'en' | 'ar' }): Promise<void> {
    const { locale } = options || {};
    const finalPath = locale && locale !== 'en' ? `/${locale}${path}` : path;
    
    await this.page.goto(finalPath);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to home page
   * Uses actual route from shared/utils/storefront-routes.ts
   */
  async goHome(): Promise<void> {
    await this.logo.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to cart page
   */
  async goToCart(): Promise<void> {
    await this.cartButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to login page
   */
  async goToLogin(): Promise<void> {
    await this.accountLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Perform search
   * Based on HeaderSearchInput.vue implementation
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Open mobile menu (burger menu)
   */
  async openMobileMenu(): Promise<void> {
    if (await this.burgerMenu.isVisible()) {
      await this.burgerMenu.click();
      await this.mobileNav.waitFor({ state: 'visible' });
    }
  }

  /**
   * Close mobile menu
   */
  async closeMobileMenu(): Promise<void> {
    // Look for close button in mobile nav
    const closeButton = this.mobileNav.locator('button[aria-label*="close"], button[class*="close"]').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.mobileNav.waitFor({ state: 'hidden' });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STATE CHECKING METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if user is authenticated
   * Looks for profile dropdown instead of login link
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.accountLink.waitFor({ state: 'hidden', timeout: 1000 });
      return await this.profileDropdown.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get cart item count from badge
   */
  async getCartCount(): Promise<number> {
    try {
      await this.cartBadge.waitFor({ state: 'visible', timeout: 2000 });
      const text = await this.cartBadge.textContent();
      return parseInt(text?.trim() || '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * Get current locale from HTML lang attribute
   * Based on app/app.vue setting lang and dir attributes
   */
  async getCurrentLocale(): Promise<string> {
    const html = this.page.locator('html');
    return (await html.getAttribute('lang')) || 'en';
  }

  /**
   * Get current theme from data-theme attribute
   * Based on app/app.vue theme script
   */
  async getCurrentTheme(): Promise<string> {
    const html = this.page.locator('html');
    return (await html.getAttribute('data-theme')) || 'light';
  }

  /**
   * Check if page is in RTL mode
   */
  async isRTL(): Promise<boolean> {
    const html = this.page.locator('html');
    const dir = await html.getAttribute('dir');
    return dir === 'rtl';
  }

  /**
   * Check if mobile menu is open
   */
  async isMobileMenuOpen(): Promise<boolean> {
    return await this.mobileNav.isVisible();
  }

  // ═══════════════════════════════════════════════════════════════
  // INTERACTION METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Toggle theme (light/dark)
   */
  async toggleTheme(): Promise<void> {
    const currentTheme = await this.getCurrentTheme();
    await this.themeToggle.click();
    
    // Wait for theme to change
    await this.page.waitForFunction(
      (expectedTheme) => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === expectedTheme;
      },
      currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  /**
   * Switch locale
   * Note: Actual implementation depends on language switcher component
   */
  async switchLocale(targetLocale: 'en' | 'ar'): Promise<void> {
    // Look for language switcher
    const langSwitcher = this.page.locator('[data-component="language-switcher"], button[aria-label*="language"]');
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      // Click the target locale option
      const localeOption = this.page.locator(`[data-locale="${targetLocale}"], button:has-text("${targetLocale === 'ar' ? 'العربية' : 'English'}")`);
      await localeOption.click();
      
      await this.waitForPageLoad();
    }
  }

  /**
   * Click notification/toast to dismiss
   */
  async dismissNotification(): Promise<void> {
    if (await this.notification.isVisible()) {
      // Look for close button or click notification itself
      const closeBtn = this.notification.locator('button[aria-label*="close"], button[class*="close"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await this.notification.click();
      }
      await this.notification.waitFor({ state: 'hidden' });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WAITING METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Wait for page to load
   * Nuxt-specific: waits for networkidle and hydration
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    // Wait for Nuxt hydration (Vue app ready)
    await this.page.waitForFunction(() => {
      return typeof window !== 'undefined' && 
             document.querySelector('[data-storefront-shell="root"]') !== null;
    });
  }

  /**
   * Wait for notification to appear
   */
  async waitForNotification(options?: { timeout?: number }): Promise<void> {
    await this.notification.waitFor({
      state: 'visible',
      timeout: options?.timeout || 5000,
    });
  }

  /**
   * Wait for cart badge to update
   */
  async waitForCartUpdate(expectedCount: number, timeout = 5000): Promise<void> {
    await this.page.waitForFunction(
      ({ count }) => {
        const badge = document.querySelector('a[href*="cart"] div[class*="absolute"]');
        if (!badge) return count === 0;
        const text = badge.textContent || '0';
        return parseInt(text, 10) === count;
      },
      { count: expectedCount },
      { timeout }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ASSERTION METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Assert page loaded correctly
   * Checks shell structure is present
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.shellRoot).toBeVisible();
    await expect(this.shellHeader).toBeVisible();
    await expect(this.mainContent).toBeVisible();
  }

  /**
   * Assert user is authenticated
   */
  async assertAuthenticated(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    expect(isAuth).toBe(true);
  }

  /**
   * Assert user is NOT authenticated
   */
  async assertNotAuthenticated(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    expect(isAuth).toBe(false);
  }

  /**
   * Assert notification is shown with specific text
   */
  async assertNotificationShown(expectedText?: string | RegExp): Promise<void> {
    await expect(this.notification).toBeVisible();
    
    if (expectedText) {
      if (typeof expectedText === 'string') {
        await expect(this.notification).toContainText(expectedText);
      } else {
        await expect(this.notification).toHaveText(expectedText);
      }
    }
  }

  /**
   * Assert cart has specific count
   */
  async assertCartCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Assert current locale
   */
  async assertLocale(expectedLocale: 'en' | 'ar'): Promise<void> {
    const currentLocale = await this.getCurrentLocale();
    expect(currentLocale).toBe(expectedLocale);
  }

  /**
   * Assert theme
   */
  async assertTheme(expectedTheme: 'light' | 'dark'): Promise<void> {
    const currentTheme = await this.getCurrentTheme();
    expect(currentTheme).toBe(expectedTheme);
  }

  /**
   * Assert RTL direction
   */
  async assertRTL(expected = true): Promise<void> {
    const isRtl = await this.isRTL();
    expect(isRtl).toBe(expected);
  }

  /**
   * Assert URL matches pattern
   */
  async assertURL(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Assert page title matches
   */
  async assertTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Take a screenshot
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Reload page and wait for load
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Check if element exists (without waiting)
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Fill form field by label
   * Useful when data-testid is not available
   */
  async fillByLabel(label: string | RegExp, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  /**
   * Click button by text
   * Useful when data-testid is not available
   */
  async clickButtonByText(text: string | RegExp): Promise<void> {
    await this.page.getByRole('button', { name: text }).click();
  }

  /**
   * Click link by text
   * Useful when data-testid is not available
   */
  async clickLinkByText(text: string | RegExp): Promise<void> {
    await this.page.getByRole('link', { name: text }).click();
  }
}
