<template>
<div class="page documents">
  <loadingScreen v-if="loading"></loadingScreen>
  <div class="container">
    <br />
    <h1>Documents</h1>
    <span class="multi-input fullwidth">
      <input v-model="search" class="input" type="text" width="100%" placeholder="Search"/>
      <a class="button input dark" width="100%">Search</a>
    </span>
    <br />
    <br />
    <a @click="openNewDoc" class="button warning" width="100%">New Document</a>

    <br /> <br />
<div class="box material" style="padding: 2%;" v-if="noDocs">
<h3>U have no docs pleb</h3>
<p @click="openNewDoc">Go make some!</p>

</div>
    <router-link v-for="doc in docs" :key="doc.key" :alt="doc.doc.info.title" :to="{ name: 'editor', params: {document: doc.key, user: doc.uid} }" class="document-preview">
      <div class="box material hover-deep container">
        <h3 >{{doc.doc.info.title}}</h3>
        <small>
         <i>Last Edited: {{doc.doc.info.date}}</i>
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
    newDoc: false,
    search: "",
    noDocs: true
  }),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        const db = firebase.database();
        db.ref(`users/${this.uid}/docs`).on("value", snapshot => {
          this.loading = false;
          this.docs = [];
          if (!snapshot.val()) {
            this.noDocs = true;
          } else {
            this.noDocs = false;
            snapshot.forEach(doc => {
              let docKey = doc.key;
              firebase
                .database()
                .ref(`documentMeta/${doc.val().uid}/${doc.val().docId}`)
                .once("value")
                .then(docMeta => {
                  console.log(docMeta.val());
                  this.docs.unshift({
                    doc: docMeta.val(),
                    key: docKey,
                    uid: doc.val().uid
                  });
                  // ...
                });

              // ...
            });
          }
        });
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    searchFilter(doc) {
      let title = doc.doc.title.toLowerCase().split(" ");
      return title.indexOf(this.search.toLowerCase()) > -1;
    },
    openNewDoc() {
      swal("New Document Name:", {
        customClass: "swal-modal",
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
        let utcDate = new Date().getTime();
        let newDoc = {
          title: name,
          date: date,
          utcdate: utcDate
        };
        let newDocUserRef = firebase
          .database()
          .ref(`users/${this.uid}/docs/`)
          .push();
        let newDocMetaRef = firebase
          .database()
          .ref(`documentMeta/${this.uid}/${newDocUserRef.key}/`);
        let newDocStorRef = firebase
          .database()
          .ref(`documents/${this.uid}/${newDocUserRef.key}`);
        newDocUserRef.set({
          docId: newDocUserRef.key,
          uid: this.uid
        });
        newDocStorRef.set({
          data: ""
        });
        newDocMetaRef.set({
          info: {
            title: name,
            date: date,
            utcDate: utcDate
          },
          users: {
            [this.uid]: this.uid
          }
        });
      });
    }
  }
};
</script>
