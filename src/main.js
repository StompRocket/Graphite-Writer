// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

const firebase = require("firebase");
let vueApp;
const config = {
  apiKey: "AIzaSyD8ebk4UWxgYLMikkwqiBahVMpjhEDfwKg",
  authDomain: "graphite-writer-v2.firebaseapp.com",
  databaseURL: "https://graphite-writer-v2.firebaseio.com",
  projectId: "graphite-writer-v2",
  storageBucket: "",
  messagingSenderId: "744364654162"
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
