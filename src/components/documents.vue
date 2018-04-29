<template>
<div class="page documents">
  <loadingScreen v-if="loading"></loadingScreen>
  <div class="container">
    <br />
    <h1>Documents</h1>
    <span class="multi-input fullwidth">
      <input class="input" type="text" width="100%" placeholder="Search"/>
      <a class="button input dark" width="100%">Search</a>
    </span>
    <br />
    <br />
    <a @click="openNewDoc" class="button warning" width="100%">New Document</a>

    <br /> <br />

    <router-link v-for="doc in docs" :key="doc.key" :alt="doc.doc.title" :to="{ name: 'editor', params: {document: doc.key} }" class="document-preview">
      <div class="box material hover-deep container">
        <h3 >{{doc.doc.title}}</h3>
        <small>
         <i>Last Edited: {{doc.doc.date}}</i>
        </small>
      </div>
      <br />
    </router-link>
  </div>

</div>
</template>
<script>
import "../assets/documents.scss";
import swal from "sweetalert";
import firebase from "firebase";
import loadingScreen from "./loadingScreen.vue";
import { log } from "util";

export default {
  name: "documents",
  components: {
    loadingScreen
  },
  data: () => ({
    newDocName: "",
    loading: true,
    uid: null,
    docs: [],
    newDoc: false
  }),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        const db = firebase.database();
        db
          .ref(`users/${this.uid}/docs`)
          .orderByChild("utcdate")
          .on("value", snapshot => {
            this.loading = false;
            this.docs = [];
            snapshot.forEach(doc => {
              var docKey = doc.key;
              this.docs.unshift({ doc: doc.val(), key: docKey });
              // ...
            });
          });
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    openNewDoc() {
      swal("New Document Name:", {
        customClass: 'swal-modal',
        content: "input"
      }).then(name => {
        if (!name) {
          name = "Untitled";
        }
        if (/^\s+$/.test(name)) {
          name = "Untitled";
        }
        console.log(name);
        // var newDocRef = firebase.database().ref('users/' + uid + '/docs/').push()

        let date = new Date();
        date = date.toString();
        let newDoc = {
          title: name,
          date: date,
          utcdate: new Date().getTime(),
          version: 2
        };
        let newDocRef = firebase
          .database()
          .ref(`users/${this.uid}/docs/`)
          .push();
        console.log(newDocRef.key);
        let newDocStorRef = firebase
          .database()
          .ref(`users/${this.uid}/docsStorage/${newDocRef.key}`);
        newDocRef.set(newDoc);
        newDocStorRef.set(newDoc);
      });
    }
  }
};
</script>
