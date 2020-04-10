import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import moment from 'moment'
import swal from 'sweetalert'
import _ from 'lodash'
import * as Sentry from '@sentry/browser';
import 'firebase/auth'
import 'firebase/remote-config'
import 'firebase/analytics'
import 'firebase/performance'
import 'minireset.css'
import './assets/main.scss'
import "@/assets/print.scss"
Vue.config.productionTip = false
const firebaseConfig = {
  apiKey: "AIzaSyAkp9Xj0ckAT1l7yLPp1CU5812g_Y8ebYI",
  authDomain: "graphite-88e41.firebaseapp.com",
  databaseURL: "https://graphite-88e41.firebaseio.com",
  projectId: "graphite-88e41",
  storageBucket: "graphite-88e41.appspot.com",
  messagingSenderId: "158148550453",
  appId: "1:158148550453:web:ea17a3b23534164945f67c",
  measurementId: "G-RX8D5M6ZGJ"
};
firebase.initializeApp(firebaseConfig)
Vue.prototype.$analytics = firebase.analytics()
Vue.prototype.$perf = firebase.performance();
Vue.prototype.$firebase = firebase
Vue.prototype.$swal = swal
Object.defineProperty(Vue.prototype, '$_', { value: _ })
Vue.prototype.$moment = moment
Sentry.init({ dsn: 'https://651a929bd0444e42ab4dd37ba4f864ac@o130965.ingest.sentry.io/289169', release: 'Graphite-Writer-App@' + process.env.npm_package_version });
let app
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

  }
});
