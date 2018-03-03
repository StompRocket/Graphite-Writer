import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import about from '@/components/about'
import documents from '@/components/documents'
import editor from '@/components/editor'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/documents',
      name: 'documents',
      component: documents
    },
    {
      path: '/d/:document',
      name: 'editor',
      component: editor
    }
  ]
})