// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    typescript: {
        shim: false
      },
      modules: [
        '@nuxtjs/tailwindcss',
  
        
    ],
    plugins: [
    // 'vue3-colorpicker'
    ],
      css: [
        '@/assets/css/main.css',
      ],
      vue: {
        config: {
          productionTip: false,
          devtools: true
        }
      }
})
