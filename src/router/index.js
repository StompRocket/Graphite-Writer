import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Documents from '../views/Documents.vue'
import Collection from '../views/Collection.vue'
import Edit from '../views/Edit.vue'
import Share from '../views/shared.vue'
import Auth from '../views/auth.vue'
import Settings from '../views/Settings.vue'
import AboutEncryption from '../views/AboutEncryption.vue'

import VueHead from 'vue-head'

Vue.use(VueHead, {
  inner: "Graphite Writer",
  separator: '|'
})
Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,

},
  {
    path: '/collection/:id',
    name: 'Collection',
    component: Collection,

  },
  /*{
    path: '/docs',
    name: 'Documents',
    component: Documents,

  }, */
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,

  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/settings/encryption',
    name: 'Encryption Settings',
    component: AboutEncryption,
  },
  {
    path: '/d/:user/:docId',
    name: 'Edit',
    component: Edit,
  },
  {
    path: '/shared/:user/:docId',
    name: 'Shared',
    component: Share,
  },
  {
    path: '/s/:user/:docId',
    redirect: '/shared/:user/:docId',
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