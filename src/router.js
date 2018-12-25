import Vue from 'vue'
import Router from 'vue-router'
import Classes from './views/classes.vue'
import Class from './views/class'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Classes',
      component: Classes
    },
    {
      path: '/class/:id',
      name: 'class',
      component: Class
    }
  ]
})
