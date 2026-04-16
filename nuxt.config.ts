import tailwindcss from '@tailwindcss/vite'

const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE ;

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  css:['@/assets/css/main.css'], 
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['@apollo/client/core', 'graphql-tag'],
    },
  },
  runtimeConfig:{
    apiBase: API_BASE_URL,
    public:{
      apiBase: API_BASE_URL,
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL,
    },
    
  },
  modules: ['@vueuse/nuxt', '@nuxtjs/i18n', 'nuxt-ssr-api-logger',
     '@pinia/nuxt','@nuxt/ui','pinia-plugin-persistedstate/nuxt', 
    //  '@nuxt/icon',
     
    ],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    langDir: 'locales',
      detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: true,
    },
      locales: [
      {
        code: 'en',
        language: 'en-US',
        dir: 'ltr',
        name: 'English',
        icon: 'i-circle-flags-gb' ,
        files: ['en/header.json', 'en/cart.json', 'en/best-seller.json','en/product.json','en/search.json',
           'en/filter.json', 'en/topbar.json','en/footer.json', 'en/checkout.json','en/orders.json',
           'en/login.json', 'en/register.json', 'en/profile.json']
      },
      {
        code: 'ar',
        language: 'ar-SA',
        dir: 'rtl',
        name: 'العربية',
        icon: 'i-circle-flags-sa' ,
        files: ['ar/header.json', 'ar/cart.json', 'ar/best-seller.json','ar/product.json', 'ar/search.json',
           'ar/filter.json', 'ar/topbar.json','ar/footer.json', 'ar/checkout.json','ar/orders.json',
           'ar/login.json', 'ar/register.json', 'ar/profile.json']
      },
      
    ]
  },
  typescript: {
    // This adds your custom types to the generated .nuxt/tsconfig.json
    tsConfig: {
      include: ['../types/**/*.d.ts'] 
    }
  }
})