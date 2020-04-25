<template>
  <div id="app">
    <div class="serverError" v-if="!server">
      <div></div>
      <div class="center">
        <img src="./assets/serverdown.svg" alt />
        <h1>{{ $t('serverConError') }}</h1>
        <p>{{ $t('serverConErrorDesc') }}</p>
      </div>
      <div class="center">
        <p>Graphite Writer v{{ version }}</p>
        <p>
          {{ $t('ifThisProblemPersists') }}
          <a href="mailto:ronan@graphitewriter.com">ronan@graphitewriter.com</a>
        </p>
      </div>
    </div>
    <div v-if="!loaded" class="loading--fullscreen">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      <img src="@/assets/wordmark.svg" alt />
      <p class="version">v{{ version }}</p>
      <p class="support">
        Something Not Working? Email support
        <a href="mailto:support@graphitewriter.com"
          >support@graphitewriter.com</a
        >
      </p>
    </div>
    <router-view v-if="server && loaded" />
    <FooterComponent v-if="server && loaded"></FooterComponent>
  </div>
</template>
<script>
import FooterComponent from './components/footer.vue'
let version = require('../package.json').version
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1)
  var sURLVariables = sPageURL.split('&')
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] == sParam) {
      return sParameterName[1]
    }
  }
}
let tokenRefresh, focus
export default {
  name: 'app',
  components: { FooterComponent },
  data() {
    return {
      version: version,
      server: true,
      loaded: false,
    }
  },
  mounted() {
    let getToken = (trig) => {
      // console.log('token trigger', trig)
      if (this.$firebase.currentUser) {
        this.$firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            this.$store.commit('setToken', idToken)
          })
      }
    }
    tokenRefresh = window.setInterval(function() {
      getToken('interval')
    }, 900000)
    focus = window.addEventListener(
      'focus',
      function() {
        getToken('focus')
      },
      false
    )

    if (window.location.hostname != 'localhost') {
      this.$config.settings = {
        minimumFetchIntervalMillis: 18000000,
      }
      this.$config
        .fetchAndActivate()
        .then(() => {
          console.log('config activated')
          if (this.$analytics) {
            this.$analytics.setUserProperties({
              prominentLocale: this.$config.getValue('prominentLocalDisplay'),
            })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    console.log(localStorage.getItem('local'))
    if (localStorage.getItem('local')) {
      this.$i18n.locale = localStorage.getItem('local')
    }
    if (this.$supportedLocales.indexOf(GetURLParameter('lang')) > -1) {
      this.$i18n.locale = GetURLParameter('lang')
      localStorage.setItem('local', this.$i18n.locale)
    }

    this.$moment.locale(this.$i18n.locale)
    if (this.$analytics) {
      this.$analytics.setUserProperties({ appVersion: version })
    }
    fetch(this.$store.getters.api)
      .then((res) => {
        console.log(res.status)
        if (res.status != 200) {
          this.server = false
        }
      })
      .catch(() => {
        this.server = false
        this.$Sentry.captureMessage('Server connection error')
      })
    this.$firebase.auth().onAuthStateChanged((user) => {
      //  console.log(user, "user")
      this.loaded = true
      if (user) {
        // User is signed in.
        this.$store.commit('setUser', user)
        //this.$analytics.setUserID(user.uid)
        this.$firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit('setToken', idToken)
            // ...
          })
      } else {
        this.$store.commit('setUser', false)
        // No user is signed in.
        console.log(this.$route.name)
        if (this.$route.name != 'Shared' && this.$route.name != 'Auth') {
          this.$router.push('/auth')
        }
      }
    })
  },
}
</script>
