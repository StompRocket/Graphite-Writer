import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyBoglY-EtYmIN5Ld5zombun4HJKhtdy39o",
  authDomain: "graphite-writer-v3.firebaseapp.com",
  databaseURL: "https://graphite-writer-v3.firebaseio.com",
  projectId: "graphite-writer-v3",
  storageBucket: "graphite-writer-v3.appspot.com",
  messagingSenderId: "44497180717"
}

firebase.initializeApp(config);
Vue.config.productionTip = false
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
