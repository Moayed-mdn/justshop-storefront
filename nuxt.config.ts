import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

  // ✅ تعطيل devtools و debug في بيئة الاختبار
  devtools: {
    enabled: process.env.NODE_ENV !== 'test',
    timeline: {
      enabled: false,
    },
  },

  // ✅ تقليل الـ logs المزعجة
  debug: false,

  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: ['.justshop.test'],
    },
    optimizeDeps: {
      include: ['@apollo/client/core', 'graphql-tag'],
    },
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || process.env.NUXT_PUBLIC_API_BASE,
    storefrontRuntimeRollout: {
      mode: (process.env.NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE
        || process.env.STOREFRONT_RUNTIME_ROLLOUT_MODE
        || 'full') as 'off' | 'internal' | 'pilot' | 'full',
      killSwitch: (process.env.NUXT_STOREFRONT_RUNTIME_KILL_SWITCH
        || process.env.STOREFRONT_RUNTIME_KILL_SWITCH
        || 'false') === 'true',
      internalTenantKeys: process.env.NUXT_STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS
        || process.env.STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS
        || 'justshop-demo,demo.justshop.test',
      pilotTenantKeys: process.env.NUXT_STOREFRONT_RUNTIME_PILOT_TENANT_KEYS
        || process.env.STOREFRONT_RUNTIME_PILOT_TENANT_KEYS
        || '',
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL,
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'nuxt-ssr-api-logger',
    '@pinia/nuxt',
    '@nuxt/ui',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
  ],

  components: [
    { path: '~/components/ui', prefix: 'Ui', pathPrefix: false },
    { path: '~/components', pathPrefix: false },
    {
      path: fileURLToPath(new URL('./src/core/rendering', import.meta.url)),
      prefix: 'Runtime',
      ignore: ['SectionBoundary.vue', 'SectionFallback.vue'],
    },
  ],

  imports: {
    dirs: [
      'shared/utils',
      'src/core/tenant',
      'src/core/api',
      'src/core/cache',
      'src/domains/**',
      'src/platform/**',
    ],
  },

  nitro: {
    imports: {
      dirs: [
        'shared/utils',
        'src/core/tenant',
        'src/core/api',
        'src/core/cache',
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    locales: [
      {
        code: 'en',
        language: 'en-US',
        dir: 'ltr',
        name: 'English',
        icon: 'i-circle-flags-gb',
        files: [
          'en/header.json', 'en/cart.json', 'en/best-seller.json',
          'en/product.json', 'en/search.json', 'en/filter.json',
          'en/topbar.json', 'en/footer.json', 'en/checkout.json',
          'en/orders.json', 'en/login.json', 'en/register.json',
          'en/profile.json', 'en/auth.json',
        ],
      },
      {
        code: 'ar',
        language: 'ar-SA',
        dir: 'rtl',
        name: 'العربية',
        icon: 'i-circle-flags-sa',
        files: [
          'ar/header.json', 'ar/cart.json', 'ar/best-seller.json',
          'ar/product.json', 'ar/search.json', 'ar/filter.json',
          'ar/topbar.json', 'ar/footer.json', 'ar/checkout.json',
          'ar/orders.json', 'ar/login.json', 'ar/register.json',
          'ar/profile.json', 'ar/auth.json',
        ],
      },
    ],
  },

  typescript: {
    tsConfig: {
      include: ['../src/**/*', '../types/**/*.d.ts'],
    },
  },
})
