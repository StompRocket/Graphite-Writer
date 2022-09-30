// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    typescript: {
        shim: false
      },
      modules: [
        '@nuxtjs/tailwindcss',
        
    ],
      css: [
        '@/assets/css/main.css',
      ]
})
