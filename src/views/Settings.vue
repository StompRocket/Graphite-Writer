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
    <div v-if="accountInfo" class="accountButton">
      <Locale></Locale>
      <p class="email">{{ user.email }}</p>
      <button class="btn" @click="logOut">{{ $t('logout') }}</button>
    </div>
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
        <div class="userRow">
          <img :src="$store.getters.user.photoURL"
               class=""/>
          <h1>{{user.displayName}}</h1>
          <p>{{user.email}}</p>
        </div>
        <div class="settingsRows">
          <div class="settingsItem">
            <p>{{$t("language")}}</p>
            <Locale></Locale>
          </div>
          <div class="settingsItem">
            <p>{{$t("settings.encryption")}}</p>
            <router-link to="/settings/encryption">{{$t("settings.learnMore")}}</router-link>
          </div>
          <div class="settingsItem">
            <p>{{$t("version")}}</p>
            <p>{{version}}</p>
          </div>
        </div>
        <div class="actions">
          <button @click="logOut" class="btn red">{{$t("logout")}}</button>
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

        loaded: false,
        accountInfo: false,
        version: require('../../package.json').version,
        trace: this.$perf.trace('loadSettings'),
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

      logOut() {
        if (this.$analytics) {
          this.$analytics.logEvent('logout')
        }
        this.$firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = 'https://graphitewriter.com'
        })
      },
    },
    components: {Locale},
    mounted() {
      if (this.$analytics) {
        this.$analytics.logEvent('openedSettingsPage')
      }
      if (this.$firebase.auth().currentUser) {
        this.loaded = true
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
