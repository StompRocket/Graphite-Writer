<template>
<div class="page login">
	<loadingScreen v-if="loading"></loadingScreen>
<div class="center-box box material deep container">
	<h3>Login to Continue:</h3>
	<br />
	<div class="row">
		<div class="column"> <button @click="loginWithGoogle" class="button warning full-button">Google</button> </div>
		<div class="column"> <button @click="loginWithGithub" class="button dark full-button">Github</button> </div>
	</div>
</div>
</div>
</template>
<script>
import '../assets/login.scss';
import loadingScreen from './loadingScreen.vue';
const firebase = require('firebase');
const provider = new firebase.auth.GoogleAuthProvider();
const gitHub = new firebase.auth.GithubAuthProvider();
export default {
  name: 'login',
  created() {
    window.scroll(0, 0);
    document.title = `Graphite Writer BETA v${this.$parent.version}  | Login`;
    //console.log(localStorage.getItem("redirect") + " params");
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.credential) {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          var token = result.credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
        if (localStorage.getItem('redirect')) {
          this.$router.push(localStorage.getItem('redirect'));
          localStorage.removeItem('redirect', null);
        } else {
          this.$router.push('/documents/');
        }
      })
      .catch(err => console.log(err));

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //console.log("loggedIn");
        // User is signed in.
        if (localStorage.getItem('redirect')) {
          this.$router.push(localStorage.getItem('redirect'));
          localStorage.removeItem('redirect', null);
        } else {
          this.$router.push('/documents/');
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
    },
    loginWithGithub() {
      firebase.auth().signInWithRedirect(gitHub);
    }
  }
};
</script>
