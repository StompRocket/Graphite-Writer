<template>
  <div id="app">
    <div class="serverError" v-if="!server">
      <div></div>
      <div class="center">
        <img src="./assets/serverdown.svg" alt="">
        <h1>Server Connection Error</h1>
        <p>Graphite Writer is having trouble connecting to its server.</p>
      </div>
      <div class="center">
        <p>Graphite Writer v{{version}}</p>
        <p>If this problem persists please contact support.
          <a href="mailto:ronan@graphitewriter.com">ronan@graphitewriter.com</a></p>
      </div>

    </div>
    <router-view v-if="server"/>
  </div>
</template>
<script>
  let version = require("../package.json").version
  export default {
    name: "app",
    data() {
      return {
        version: version,
        server: true
      }
    },
    mounted() {
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
