<template>
  <div id="app">
    <div class="serverError" v-if="!server">
      <div></div>
      <div class="center">
        <img src="./assets/serverdown.svg" alt="">
        <h1>{{$t("serverConError")}}</h1>
        <p>{{$t("serverConErrorDesc")}}</p>
      </div>
      <div class="center">
        <p>Graphite Writer v{{version}}</p>
        <p>{{$t("ifThisProblemPersists")}} <a href="mailto:ronan@graphitewriter.com">ronan@graphitewriter.com</a></p>
      </div>

    </div>
    <router-view v-if="server"/>
    <FooterComponent></FooterComponent>
  </div>
</template>
<script>
  import FooterComponent from "./components/footer.vue"
  let version = require("../package.json").version
  export default {
    name: "app",
    components: {FooterComponent},
    data() {
      return {
        version: version,
        server: true
      }
    },
    mounted() {
      if (window.location.hostname != "localhost") {
        this.$config.settings = {
          minimumFetchIntervalMillis: 18000000,
        };
        this.$config.fetchAndActivate()
        .then(() => {
          console.log("config activated")
          this.$analytics.setUserProperties({prominentLocale: this.$config.getValue("prominentLocalDisplay")})
        })
        .catch((err) => {
          console.error(err);
        });
      }

      console.log(localStorage.getItem("local"))
      if (localStorage.getItem("local")) {

        this.$i18n.locale = localStorage.getItem("local")
      }

      this.$analytics.setUserProperties({appVersion: version})
      fetch(this.$store.getters.api).then(res => {
        console.log(res.status)
        if (res.status != 200) {
          this.server = false
        }
      }).catch(() => {
        this.server = false
        this.$Sentry.captureMessage('Server connection error');
      })
      this.$firebase.auth().onAuthStateChanged((user) => {

        //  console.log(user, "user")
        if (user) {
          // User is signed in.
          this.$store.commit("setUser", user)
          //this.$analytics.setUserID(user.uid)
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit("setToken", idToken)
            // ...
          })
        } else {
          this.$store.commit("setUser", false)
          // No user is signed in.
          console.log(this.$route.name)
          if (this.$route.name != "Share") {

            var provider = new this.$firebase.auth.GoogleAuthProvider();
            this.$firebase.auth().signInWithRedirect(provider);
          }
        }
      });
    }
  }
</script>
