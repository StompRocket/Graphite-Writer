<template>
<div class="page">
  <nav class="navbar white">
    <div class="container">
      <div class="nav-logo">
       <router-link to="/"><img src="./assets/wordmark.png" /></router-link> 
      </div>
      <a class="nav-burger" href="#nav-mobile"><i class="fas fa-bars"></i></a>
      <div class="nav-menu">
        <router-link class="white" :to="{ name: 'documents' }">Documents</router-link>
        &nbsp;&nbsp;
        <a @click="login" class="white">{{loginText}}</a>
      </div>
    </div>
  </nav>
  <router-view />
  <footer class="footer">
    <div class="child-div">
      <img v-if="$route.path == '/'" src="./assets/icon.svg" style="background-color: transparent;" id="bottom-logo" />
    </div>
    <div class="container">
      <br />

      <div class="row">
        <div class="column">
          Graphite Writer is supported by <b>{{supporters}}</b>. Want your name up here? Help support our development by buying a shirt, or donating. 
        </div>
        <div class="column">
          Website is licenced under
          <a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank" class="dark"><b>Apache Licene 2.0</b></a>. A simplified explenation of the license can be found <a href="https://tldrlegal.com/license/apache-license-2.0-%28apache-2.0%29" target="_blank" class="dark"><b>here</b></a>.
        </div>
        <div class="column">
          Created by Ronan and Sasha S. View the code on <a href="https://github.com/StompRocket/Graphite-Writer" class="dark"><b>Github</b></a>. Have a question, or a suggestion? Send us an <a href="mailto:hello@stomprocket.io" class="dark"><b>email</b></a>. We'll try our best to respond as soon as we can.
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
      loginText: "Login",
      supporters: "Jack, Rohan, Liam, Merideth"
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
      
        // User is signed in.
        this.loginText = "Logout";

        firebase
          .database()
          .ref("users/" + user.uid + "/info")
          .set({
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
            uid: user.uid
          });
        firebase
          .database()
          .ref("users/" + user.uid + "/publicInfo")
          .set({
            name: user.displayName,
            profile_picture: user.photoURL,
            uid: user.uid
          });
      } else {
        this.loginText = "Login";
      }
    });
  },
  updated() {
    var user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref("users/" + user.uid + "/timeData")
        .push()
        .set({
          utc: new Date().getTime(),
          route: this.$route.path
        });
    }
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
