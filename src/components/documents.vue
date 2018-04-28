<template>
<div class="page documents">
  <loadingScreen v-if="loading"></loadingScreen>
  <div class="container">
    <br />
    <h1>Documents</h1>
    <span class="multi-input fullwidth">
      <input class="input" type="text" width="100%" placeholder="Search"/>
      <a class="button input warning" width="100%" href="#newDocumentModal">Search</a>
    </span>
    <br />
    <br />
    <a class="button warning" width="100%" href="#newDocumentModal">New Document</a>

    <br /> <br />

    <router-link v-for="doc in docs" :to="{ name: 'editor', params: {document: '234fsdf'} }" class="document-preview">
      <div class="box material container">
        <h3>{{doc.title}}</h3>
        <small>
         <i>Last Edited: datetime</i>
        </small>
      </div>

    </router-link>
  </div>
  <div class="modal" id="newDocumentModal">
    <div class="modal-body box material deep">
      <div class="container">
        <i class="modal-close fas fa-times" /> <br />
        <h3>Create Document </h3>
        <span class="multi-input">
          <input type="text" class="input" v-model="newDocName" placeholder="Name Your Document" @keyup.enter="newDoc"/>
          <router-link class="button primary input" :to="{name: 'editor', params: {document: 'new', name: newDocName}}">Create</router-link>
        </span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import "../assets/documents.scss";
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
    docs: []
  }),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        const db = firebase.database();
        db
          .ref(`users/${this.uid}/docs`)
          .orderByChild("utcdate")
          .once("value", snapshot => {
            this.loading = false;
            snapshot.forEach(doc => {
              var docKey = doc.key;
              this.docs.push(doc.val());
              // ...
            });
          });
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    newDoc() {
      this.$router.push({
        name: "editor",
        params: {
          document: "new",
          name: this.newDocName
        }
      });
    }
  }
};
</script>
