<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: "app",
    mounted() {
      this.$firebase.auth().onAuthStateChanged((user) => {
      //  console.log(user, "user")
        if (user) {
          // User is signed in.
          this.$store.commit("setUser", user)
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit("setToken", idToken)
            // ...
          })
        } else {
          this.$store.commit("setUser", false)
          // No user is signed in.
          console.log(this.$route.name)
          if (this.$route.name != "Shared") {

            var provider = new this.$firebase.auth.GoogleAuthProvider();
            this.$firebase.auth().signInWithRedirect(provider);
          }
        }
      });
    }
  }
</script>
