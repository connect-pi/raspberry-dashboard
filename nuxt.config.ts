export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  ssr: true,

  // Color Mode Configuration
  colorMode: {
    classSuffix: '',
    preference: 'system', // Let user control the theme
    fallback: 'light'
  },

  css: [
    'assets/fonts/NOTHING/style.css',
    '/assets/fonts/ChakraPetch/style.css'
  ],

  devServer: {
    port: 3000
  },

  compatibilityDate: '2024-11-30'
})
