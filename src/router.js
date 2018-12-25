import Vue from 'vue'
import Router from 'vue-router'
import Classes from './views/classes.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Classes',
      component: Classes
    }
  ]
})
