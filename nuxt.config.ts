// https://nuxt.com/docs/api/configuration/nuxt-config

const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css:['@/assets/css/main.css'],
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
     baseUrl: 'http://localhost:3000',
    locales: [
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English' ,  files: ['en/header.json'] },
      { code: 'ar', language: 'ar-SA', dir: 'rtl', name: 'العربية' ,  files: ['ar/header.json'] },
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English' ,  files: ['en/cart.json'] },
      { code: 'ar', language: 'ar-SA', dir: 'rtl', name: 'العربية' ,  files: ['ar/cart.json'] },
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English' ,  files: ['en/best-seller.json'] },
      { code: 'ar', language: 'ar-SA', dir: 'rtl', name: 'العربية' ,  files: ['ar/best-seller.json'] },
    ],
    langDir: '../i18n/locales', 
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