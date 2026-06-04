import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(configDir, 'tests/.env.test'),
});

if (!process.env.NUXT_PUBLIC_SITE_URL) {
  dotenv.config();
}

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // ✅ استخدام worker واحد مثل Next.js
  workers: 1,

  // ✅ هذا هو السبب - list reporter يظهر النتائج مباشرة في الـ terminal
  reporter: 'list',

  use: {
    baseURL: process.env.NUXT_PUBLIC_SITE_URL || 'http://demo.justshop.test:3000',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    extraHTTPHeaders: {
      'X-Tenant-Id': process.env.TEST_TENANT_ID || 'demo',
      'Accept-Language': 'en',
    },

    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
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

    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },

    {
      name: 'Arabic RTL',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        extraHTTPHeaders: {
          'X-Tenant-Id': process.env.TEST_TENANT_ID || 'demo',
          'Accept-Language': 'ar',
        },
      },
    },

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

  webServer: {
    command: 'npm run dev',
    url: 'http://demo.justshop.test:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // ✅ إخفاء logs الـ WebServer
    stdout: 'ignore',
    stderr: 'ignore',
    env: {
      NUXT_PUBLIC_API_BASE:
        process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',

      NUXT_PUBLIC_GRAPHQL_URL:
        process.env.NUXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',

      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',

      STOREFRONT_RUNTIME_ROLLOUT_MODE:
        process.env.STOREFRONT_RUNTIME_ROLLOUT_MODE || 'full',

      STOREFRONT_RUNTIME_KILL_SWITCH:
        process.env.STOREFRONT_RUNTIME_KILL_SWITCH || 'false',

      STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS:
        process.env.STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS ||
        'justshop-demo,demo.justshop.test',
    },
  },

  timeout: 30 * 1000,

  expect: {
    timeout: 5 * 1000,
  },

  outputDir: 'test-results/',

  snapshotDir: './tests/__snapshots__',
});