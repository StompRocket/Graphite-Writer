<template>
  <div class="page shareRedirect" style="height: 100vh;">
      <loadingScreen></loadingScreen>
  </div>
</template>
<script>
import firebase from "firebase";
import loadingScreen from "./loadingScreen.vue";
export default {
  name: "shareRedirect",
  components: {
    loadingScreen
  },
  created() {
    let userShort = this.$route.params.user;
    let docShort = this.$route.params.document;
    firebase
      .database()
      .ref(`/refs/${userShort}/${docShort}/`)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          this.$router.push(
            `/d/${snapshot.val().docUser}/${snapshot.val().docId}`
          );
        } else {
          this.$router.push("/");
        }
      });
  }
};
</script>