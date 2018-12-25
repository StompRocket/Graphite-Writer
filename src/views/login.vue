<template>
  <main class="page login">
<loader id="loginLoader"/>
    <div id="firebaseUi"></div>
  </main>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import firebaseui from 'firebaseui'
  import loader from '@/components/loader'

  export default {
    name: "login",
    components: {loader},
    methods: {},
    mounted() {
      this.$parent.loading = true;

      const uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          uiShown() {
            document.getElementById('loginLoader').style.display = 'none'
            console.log('loaded')
            // The widget is rendered.
            // Hide the loader.

          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'redirect',
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,

        ],
        // Terms of service url.
        tosUrl: 'https://graphitewriter.com/termsofservice',
        // Privacy policy url.
        privacyPolicyUrl: 'https://graphitewriter.com/termsofservice'
      };
      let ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseUi', uiConfig);
      firebase.auth().onAuthStateChanged(user => {

        if (user) {
          this.$router.push('/')
        }
      })
    }
  }
</script>
