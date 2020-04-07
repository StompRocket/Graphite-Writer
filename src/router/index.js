import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Edit from '../views/Edit.vue'
import Share from '../views/shared.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
      path: '/d/:user/:docId',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/shared/:user/:docId',
      name: 'Share',
      component: Share
    },
    {
      path: '*',
      redirect: "/"
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
