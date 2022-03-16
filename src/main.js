import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import moment from 'moment'
import 'moment/locale/pt.js'
import swal from 'sweetalert'
import _ from 'lodash'
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from "@sentry/tracing";
import 'firebase/auth'
import 'firebase/remote-config'
import 'firebase/analytics'
import 'firebase/performance'
import 'minireset.css'
import './assets/main.scss'
import '@/assets/print.scss'
import i18n from './i18n'
Vue.config.productionTip = false
const version = require('../package.json').version
const firebaseConfig = {
  apiKey: 'AIzaSyAkp9Xj0ckAT1l7yLPp1CU5812g_Y8ebYI',
  authDomain: 'graphitewriter.com',
  databaseURL: 'https://graphite-88e41.firebaseio.com',
  projectId: 'graphite-88e41',
  storageBucket: 'graphite-88e41.appspot.com',
  messagingSenderId: '158148550453',
  appId: '1:158148550453:web:ea17a3b23534164945f67c',
  measurementId: 'G-RX8D5M6ZGJ',
}
firebase.initializeApp(firebaseConfig)
const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
let loadedLocales = []
locales.keys().forEach((key) => {
  const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  if (matched && matched.length > 1) {
    const locale = matched[1]
    loadedLocales.push(locale)
  }
})
//console.log(loadedLocales)
Vue.prototype.$supportedLocales = loadedLocales
Vue.prototype.$config = firebase.remoteConfig()
Vue.prototype.$firebase = firebase
Vue.prototype.$swal = swal
Object.defineProperty(Vue.prototype, '$_', {
  value: _,
})

Vue.prototype.$moment = moment
if (window.location.hostname != 'localhost') {
  console.log('production', window.hostname)
  Vue.prototype.$perf = firebase.performance()
  Vue.prototype.$analytics = firebase.analytics()
  Sentry.init({
    dsn:
      'https://651a929bd0444e42ab4dd37ba4f864ac@o130965.ingest.sentry.io/289169',
      integrations: [new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "app.graphitewriter.com", /^\//],
      })],
      tracesSampleRate: 0.2,
    release: 'Graphite-Writer-App@' + version,
  })
  Vue.prototype.$Sentry = Sentry
} else {
  console.log('development')
  Vue.prototype.$analytics = false
  Vue.prototype.$perf = {
    trace() {
      return {
        stop() {
          return
        },
        start() {
          return
        },
      }
    },
    stop() {
      return
    },
    start() {
      return
    },
  }
}

let app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
