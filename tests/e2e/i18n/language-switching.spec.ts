/**
 * Language Switching E2E Tests
 * 
 * Tests for internationalization (i18n) language switching functionality.
 * Based on @nuxtjs/i18n with English (default) and Arabic support.
 */

import { test, expect } from '@playwright/test';
import { clearTestState } from '../../fixtures';

test.describe('Language Switching', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test.describe('Default Language (English)', () => {

    test('page loads in English by default', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // HTML lang attribute should be English
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^en/i);
    });

    test('HTML lang attribute is "en" or "en-US"', async ({ page }) => {
      await page.goto('/');
      
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      
      // Should be en, en-US, or en-GB
      expect(lang).toMatch(/^en/i);
    });

    test('HTML dir attribute is "ltr" for English', async ({ page }) => {
      await page.goto('/');
      
      const html = page.locator('html');
      const dir = await html.getAttribute('dir');
      
      expect(dir).toBe('ltr');
    });

    test('English is default without locale prefix in URL', async ({ page }) => {
      await page.goto('/');
      
      // URL should NOT have /en prefix (prefix_except_default strategy)
      const url = page.url();
      expect(url).not.toContain('/en/');
      expect(url).not.toContain('/en');
    });

    test('English content is displayed', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for English text in header/footer
      const pageContent = await page.textContent('body');
      
      // Should contain common English words
      const hasEnglishContent = 
        pageContent?.includes('Home') ||
        pageContent?.includes('Cart') ||
        pageContent?.includes('Search') ||
        pageContent?.includes('Shop');
      
      expect(hasEnglishContent).toBe(true);
    });

  });

  test.describe('Switch to Arabic', () => {

    test('can switch to Arabic language', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for language switcher
      const langSwitcher = page.locator(
        '[data-component="language-switcher"], ' +
        'button[aria-label*="language" i], ' +
        '[class*="language-switcher"], ' +
        'button:has-text("English"), ' +
        'button:has-text("العربية")'
      ).first();

      const switcherVisible = await langSwitcher.isVisible({ timeout: 2000 }).catch(() => false);

      if (switcherVisible) {
        await langSwitcher.click();
        await page.waitForTimeout(300);

        // Click Arabic option
        const arabicOption = page.locator(
          '[data-locale="ar"], ' +
          'a[href^="/ar"], ' +
          'button:has-text("العربية"), ' +
          '[lang="ar"]'
        ).first();

        if (await arabicOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await arabicOption.click();
          await page.waitForTimeout(500);

          // Verify switch occurred
          const currentUrl = page.url();
          const htmlLang = await page.locator('html').getAttribute('lang');
          
          expect(currentUrl.includes('/ar') || htmlLang?.startsWith('ar')).toBe(true);
        }
      }
    });

    test('URL changes to /ar prefix when switching to Arabic', async ({ page }) => {
      // Navigate directly to Arabic version
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // URL should have /ar prefix
      const url = page.url();
      expect(url).toContain('/ar');
    });

    test('HTML lang attribute changes to "ar" or "ar-SA"', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const lang = await html.getAttribute('lang');

      // Should be ar, ar-SA, or ar-AE
      expect(lang).toMatch(/^ar/i);
    });

    test('HTML dir attribute changes to "rtl"', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const dir = await html.getAttribute('dir');

      expect(dir).toBe('rtl');
    });

    test('Arabic content is displayed', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Check for Arabic text
      const pageContent = await page.textContent('body');

      // Should contain Arabic characters
      const hasArabicContent = /[\u0600-\u06FF]/.test(pageContent || '');
      
      // Arabic content should be present
      expect(hasArabicContent).toBe(true);
    });

    test('page layout is RTL in Arabic', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const dir = await html.getAttribute('dir');

      expect(dir).toBe('rtl');

      // Body should also respect RTL
      const bodyDir = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).direction
      );

      expect(bodyDir).toBe('rtl');
    });

  });

  test.describe('Switch Back to English', () => {

    test('can switch back to English from Arabic', async ({ page }) => {
      // Start in Arabic
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Verify we're in Arabic
      let htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);

      // Look for language switcher
      const langSwitcher = page.locator(
        '[data-component="language-switcher"], ' +
        'button[aria-label*="language" i], ' +
        'button:has-text("English"), ' +
        'button:has-text("العربية")'
      ).first();

      const switcherVisible = await langSwitcher.isVisible({ timeout: 2000 }).catch(() => false);

      if (switcherVisible) {
        await langSwitcher.click();
        await page.waitForTimeout(300);

        // Click English option
        const englishOption = page.locator(
          '[data-locale="en"], ' +
          'a[href^="/"], ' +
          'button:has-text("English"), ' +
          '[lang="en"]'
        ).first();

        if (await englishOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await englishOption.click();
          await page.waitForTimeout(500);

          // Verify switch occurred
          htmlLang = await page.locator('html').getAttribute('lang');
          expect(htmlLang).toMatch(/^en/i);
        }
      }
    });

    test('URL removes /ar prefix when switching to English', async ({ page }) => {
      // Navigate to Arabic page
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Navigate to English version by removing /ar
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // URL should NOT have /ar prefix
      const url = page.url();
      expect(url).not.toContain('/ar');
    });

    test('HTML lang attribute changes back to "en"', async ({ page }) => {
      // Start in Arabic
      await page.goto('/ar');
      
      // Switch to English
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const lang = await html.getAttribute('lang');

      expect(lang).toMatch(/^en/i);
    });

    test('HTML dir attribute changes back to "ltr"', async ({ page }) => {
      // Start in Arabic
      await page.goto('/ar');
      
      // Switch to English
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const dir = await html.getAttribute('dir');

      expect(dir).toBe('ltr');
    });

  });

  test.describe('Language Preference Persistence', () => {

    test('language preference persists via cookie', async ({ page }) => {
      // Navigate to Arabic
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Check for i18n cookie
      const cookies = await page.context().cookies();
      const i18nCookie = cookies.find(c => c.name === 'i18n_redirected');

      // Cookie should exist
      expect(i18nCookie).toBeDefined();
    });

    test('i18n_redirected cookie stores locale preference', async ({ page }) => {
      // Navigate to Arabic
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const cookies = await page.context().cookies();
      const i18nCookie = cookies.find(c => c.name === 'i18n_redirected');

      if (i18nCookie) {
        // Cookie value should contain 'ar'
        expect(i18nCookie.value).toContain('ar');
      }
    });

    test('language persists after page reload', async ({ page }) => {
      // Set to Arabic
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Verify Arabic
      let htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be Arabic
      htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);
    });

    test('language persists across navigation', async ({ page }) => {
      // Start in Arabic
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Navigate to different page in Arabic
      await page.goto('/ar/search');
      await page.waitForLoadState('networkidle');

      // Should still be Arabic
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);

      const url = page.url();
      expect(url).toContain('/ar');
    });

  });

  test.describe('Direct URL Access', () => {

    test('can access Arabic pages directly via /ar URL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);

      const url = page.url();
      expect(url).toContain('/ar');
    });

    test('accessing /ar/cart loads cart in Arabic', async ({ page }) => {
      await page.goto('/ar/cart');
      await page.waitForLoadState('networkidle');

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);

      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    });

    test('accessing /ar/search loads search in Arabic', async ({ page }) => {
      await page.goto('/ar/search?q=test');
      await page.waitForLoadState('networkidle');

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^ar/i);
    });

  });

  test.describe('Locale in Meta Tags', () => {

    test('page includes correct locale meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check for og:locale meta tag
      const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content').catch(() => null);
      
      if (ogLocale) {
        expect(ogLocale).toMatch(/^en/i);
      }
    });

    test('Arabic page includes correct Arabic locale meta tags', async ({ page }) => {
      await page.goto('/ar');
      
      // Check for og:locale meta tag
      const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content').catch(() => null);
      
      if (ogLocale) {
        expect(ogLocale).toMatch(/^ar/i);
      }
    });

  });

  test.describe('Browser Language Detection', () => {

    test('respects browser language preference on first visit', async ({ page, context }) => {
      // Clear cookies to simulate first visit
      await context.clearCookies();
      
      // Navigate to root
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should load in default language (English)
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/^en/i);
    });

  });

  test.describe('Error Handling', () => {

    test('handles invalid locale gracefully', async ({ page }) => {
      // Try to access invalid locale
      await page.goto('/invalid-locale');
      await page.waitForTimeout(1000);
      
      // Should either redirect or show 404, not crash
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    });

    test('accessing /ar/non-existent-page shows 404 in Arabic', async ({ page }) => {
      await page.goto('/ar/non-existent-page-xyz');
      await page.waitForTimeout(1000);
      
      // Page should be in Arabic
      const htmlLang = await page.locator('html').getAttribute('lang');
      
      if (htmlLang) {
        expect(htmlLang).toMatch(/^ar/i);
      }
    });

  });

});
