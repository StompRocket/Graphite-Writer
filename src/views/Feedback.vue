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

    <div class="settingsScreen">
      <div class="feedBackApp">
        <div id="typeForm"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Locale from '@/components/locale.vue'
  import * as typeformEmbed from '@typeform/embed'

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
        this.$analytics.logEvent('openedFeedback')
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
            let object = document.getElementById("typeForm")
            console.log(object)
            typeformEmbed.makeWidget(object, "https://ronan092344.typeform.com/to/WkVNS1", {
              onSubmit: () => {
                console.log("submitted")
                window.localStorage.setItem("feedback", "true")
                this.$router.push("/")
              }
            })
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
