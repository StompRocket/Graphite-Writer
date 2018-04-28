// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
const firebase = require("firebase");
let vueApp;
const config = {
  apiKey: "AIzaSyAkp9Xj0ckAT1l7yLPp1CU5812g_Y8ebYI",
  authDomain: "graphite-88e41.firebaseapp.com",
  databaseURL: "https://graphite-88e41.firebaseio.com",
  projectId: "graphite-88e41",
  storageBucket: "graphite-88e41.appspot.com",
  messagingSenderId: "158148550453"
};
firebase.initializeApp(config);
Vue.config.productionTip = false;

/* eslint-disable no-new */

vueApp = new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: {
    App
  }
});
