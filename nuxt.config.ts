export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  ssr: false,
  
  // Color Mode Configuration
  colorMode: {
    classSuffix: '',
    preference: 'system', // Let user control the theme
    fallback: 'light'
  },

  // UI configuration
  ui: {
    primary: 'emerald',
    gray: 'cool'
  },

  devServer: {
    port: 3000
  }
})