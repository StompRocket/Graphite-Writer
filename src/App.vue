<template>
<div class="page">

  <nav class="navbar white">
    <div class="container">
      <div class="nav-logo">
        <img src="./assets/wordmark.png" />
      </div>
      <a class="nav-burger" href="#nav-mobile"><i class="fas fa-bars"></i></a>
      <div class="nav-menu">
        <router-link class="white" :to="{ name: 'documents' }">Documents</router-link>
      </div>
       <div class="nav-menu">
        <a @click="login" class="white">{{loginText}}</a>
      </div>
    </div>
  </nav>
  <router-view/>
  <footer class="footer">
    <div class="container">
      <br />

      <div class="row">
        <div class="column">
          Graphite Writer is supported by: (names)
        </div>
        <div class="column">
          Website is licenced under
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><b>CC-BY-NC-SA 4.0</b></a>
        </div>
        <div class="column">
          Created by Ronan and Sasha S.
        </div>
      </div>
      <br />
    </div>
  </footer>
</div>
</template>

<script>
import "../node_modules/minireset.css/minireset.min.css";
import "./assets/global.scss";
const firebase = require("firebase");
export default {
  name: "App",
  data() {
    return {
      loginText: "Login"
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("loggedIn");
        // User is signed in.
        this.loginText = "Logout";
      } else {
        this.loginText = "Login";
      }
    });
  },
  methods: {
    login() {
      let user = firebase.auth().currentUser;

      if (user) {
        // User is signed in.
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.push("/");
          })
          .catch(function(error) {
            // An error happened.
          });
      } else {
        // No user is signed in.
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style>

</style>
