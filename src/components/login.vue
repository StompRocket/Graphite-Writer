<template>
<div class="page login">
	<loadingScreen v-if="loading"></loadingScreen>
<div class="center-box box material deep container">
	<h3>Login to Continue:</h3>
	<br />
	<div class="row">
		<div class="column"> <a @click="loginWithGoogle" class="button warning">Google</a> </div>
		<div class="column"> <a class="button dark">Github</a> </div>
	</div>
</div>
</div>
</template>
<script>
import "../assets/login.scss";
import loadingScreen from "./loadingScreen.vue";
const firebase = require("firebase");
const provider = new firebase.auth.GoogleAuthProvider();
export default {
  name: "login",
  created() {
    console.log(localStorage.getItem("redirect") + " params");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("loggedIn");
        // User is signed in.
        if (localStorage.getItem("redirect")) {
          this.$router.push(localStorage.getItem("redirect"));
          localStorage.removeItem("redirect", null);
        } else {
          this.$router.push("/documents/");
        }
      } else {
        this.loading = false;
      }
    });
  },
  components: {
    loadingScreen
  },
  data: () => ({
    loading: true
  }),
  methods: {
    loginWithGoogle() {
      firebase.auth().signInWithRedirect(provider);
    }
  }
};
</script>
