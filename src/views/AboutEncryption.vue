<template>
  <div class="home page">
    <nav class="nav">
      <router-link to="/">
        <img class="brand--wordmark" src="@/assets/wordmark.svg"/>
      </router-link>


      <Locale v-if="prominentLocale"></Locale>
      <router-link to="/settings"><img

          :src="$store.getters.user.photoURL"
          class="user"
          alt=""
      /></router-link>

    </nav>
    <div v-if="!loaded" class="loading">
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
      <img src="@/assets/wordmark.svg" alt=""/>
      <p class="version">v{{ version }}</p>
    </div>
    <div v-if="loaded" class="settingsScreen">
      <div class="settingsApp">
        <img class="settingsImage" src="../assets/undraw_security_o890.svg" alt="Security guard guarding data">
        <h1 class="heading">Graphite Writer Encryption</h1>
        <p class="text">By default Graphite Writer documents are transferred over https, this means that your documents
          are scrambled and encrypted between your device and our servers. However, documents are currently not stored in an encrypted format. We are working on building methods that will allow your documents to always be encrypted.</p>
        <div class="actions">
          <router-link class="btn" to="/settings">Done</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Locale from '@/components/locale.vue'

  let timeout = null
  export default {
    name: 'Home',
    head: {
      title: {
        inner: "Graphite Writer",
        complement: 'Settings'
      },

    },
    data() {
      return {

        prominentLocale: this.$config.getValue('prominentLocalDisplay') == 'true',
        locale: 'en',

        loaded: true,
        accountInfo: false,
        version: require('../../package.json').version,
        trace: this.$perf.trace('loadSettingsAboutEncryption'),
      }
    },
    created() {
      this.trace.start()
    },
    computed: {
      user() {
        return this.$store.state.user
      },
    },
    methods: {

    },
    components: {Locale},
    mounted() {
      if (this.$analytics) {
        this.$analytics.logEvent('loadSettingsAboutEncryption')
      }
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit('setToken', idToken)

            this.loaded = true
            this.trace.stop()
            if (
              !localStorage.getItem('languageFeature') &&
              this.prominentLocale
            ) {

              if (this.$analytics) {
                this.$analytics.logEvent('shownLanguageFeature')
              }
            }
            //console.log( this.$store.state.token)
          })
        } else {
        }
      })
    },
  }
</script>
