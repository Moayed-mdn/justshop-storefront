// https://nuxt.com/docs/api/configuration/nuxt-config

const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css:['@/assets/css/base/_variables.css'], 
  runtimeConfig:{
    public:{
      apiBase: API_BASE_URL
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt','@nuxtjs/i18n'],
//   image: {
//     alias: {
//       backend: API_BASE_URL
//     },
//     domains: ['localhost:8000']
//   }
// ,
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    lazy: true,
    locales: [
      {
        code: 'en',
        language: 'en-US',
        dir: 'ltr',
        name: 'English',
        files: ['en/header.json', 'en/cart.json', 'en/best-seller.json']
      },
      {
        code: 'ar',
        language: 'ar-SA',
        dir: 'rtl',
        name: 'العربية',
        files: ['ar/header.json', 'ar/cart.json', 'ar/best-seller.json']
      }
    ],
    langDir: 'i18n/locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      redirectOn: 'root',
    },
  },
  typescript: {
    // This adds your custom types to the generated .nuxt/tsconfig.json
    tsConfig: {
      include: ['../types/**/*.d.ts'] 
    }
  }
})