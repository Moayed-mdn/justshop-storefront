import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Playwright Configuration for JustShop Frontend
 * 
 * Based on actual project structure:
 * - Nuxt 4 with Vue 3.5.24
 * - Multi-tenant architecture (requires X-Tenant-Id header)
 * - Session-based auth (ecommerce_session, XSRF-TOKEN, js_auth cookies)
 * - i18n with English (default) + Arabic (RTL)
 * - Dev server on port 3000
 */

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, 'tests/.env.test') });

// Fallback to .env if test env file doesn't exist
if (!process.env.NUXT_PUBLIC_SITE_URL) {
  dotenv.config();
}

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory based on recommended structure from PLAYWRIGHT.md
  testDir: './tests/e2e',
  
  // Glob patterns for test files
  testMatch: '**/*.spec.ts',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Workers: use 1 in CI for stability, auto on local
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    // Add GitHub Actions reporter in CI
    ...(process.env.CI ? [['github'] as const] : []),
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL from actual Nuxt config (default port 3000)
    baseURL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure (helpful for debugging)
    screenshot: 'only-on-failure',
    
    // Video on first retry (helps debug flaky tests)
    video: 'retain-on-failure',
    
    // CRITICAL: Multi-tenant header required for all API requests
    // Based on actual server/utils/api.ts and server/middleware/01.tenant.ts
    extraHTTPHeaders: {
      'X-Tenant-Id': process.env.TEST_TENANT_ID || 'demo',
      'Accept-Language': 'en',
    },
    
    // Navigation timeout (30 seconds)
    navigationTimeout: 30000,
    
    // Action timeout (10 seconds)
    actionTimeout: 10000,
  },

  // Configure projects for major browsers + mobile devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Emulate actual storefront viewport
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile devices (important for e-commerce)
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 13'],
      },
    },

    // Tablet
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },

    // Arabic locale testing (RTL layout)
    // Based on actual i18n config with Arabic support
    {
      name: 'Arabic RTL',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        // Override headers for Arabic
        extraHTTPHeaders: {
          'X-Tenant-Id': process.env.TEST_TENANT_ID || 'demo',
          'Accept-Language': 'ar',
        },
      },
    },

    // Mobile Arabic
    {
      name: 'Mobile Arabic RTL',
      use: {
        ...devices['Pixel 5'],
        locale: 'ar-SA',
        extraHTTPHeaders: {
          'X-Tenant-Id': process.env.TEST_TENANT_ID || 'demo',
          'Accept-Language': 'ar',
        },
      },
    },
  ],

  // Web server configuration
  // Uses actual npm script from package.json: "dev": "nuxt dev"
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for Nuxt to start
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      // Use environment variables from actual .env.example
      NUXT_PUBLIC_API_BASE: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
      NUXT_PUBLIC_GRAPHQL_URL: process.env.NUXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',
      NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      
      // Storefront runtime rollout controls (actual env vars from nuxt.config.ts)
      STOREFRONT_RUNTIME_ROLLOUT_MODE: process.env.STOREFRONT_RUNTIME_ROLLOUT_MODE || 'full',
      STOREFRONT_RUNTIME_KILL_SWITCH: process.env.STOREFRONT_RUNTIME_KILL_SWITCH || 'false',
      STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS: process.env.STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS || 'justshop-demo,demo.justshop.test',
    },
  },

  // Global setup/teardown
  // globalSetup: require.resolve('./tests/global-setup'),
  // globalTeardown: require.resolve('./tests/global-teardown'),

  // Timeout for each test (30 seconds default)
  timeout: 30 * 1000,

  // Expect timeout (5 seconds)
  expect: {
    timeout: 5 * 1000,
  },

  // Output folder for test artifacts
  outputDir: 'test-results/',

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  // This is relative to the config file
  snapshotDir: './tests/__snapshots__',
});
