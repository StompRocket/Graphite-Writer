
import { ColorPicker } from 'vue-accessible-color-picker'

export default defineNuxtPlugin((NuxtApp) => {
    NuxtApp.vueApp.use(ColorPicker, {name: 'color-picker'})
    

  })