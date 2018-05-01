<template>
<div class="page editor">
    <loadingScreen v-if="loading"></loadingScreen>
  <br />
  <div class="container">
    <div class="box container material docInfo">
      <input @input="saveDoc()" id="docTitle" v-model="docMeta.title" type="text" contenteditable="true">
      
       <small>Last Edited: {{docMeta.date}}</small>
    </div>
    <br />
    <div id="toolbar"></div>
    <div id="editor"></div>
  </div>
   
</div>
</template>
<script>
import "../assets/editor.scss";
import "../assets/quill/quill.snow.css";
import "../assets/quill/quill.min.js";
import firebase from "firebase";
import loadingScreen from "./loadingScreen.vue";
import sjcl from "../assets/sjcl.js";
import loadingScreenVue from "./loadingScreen.vue";
import { log } from "util";
let typingTimer; //timer identifier
let doneTypingInterval = 5000;
let updates = [];
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
//console.log(sjcl);
function encrypt(data, key) {
  if (data && key) {
    data = JSON.stringify(data);
    data = sjcl.encrypt(key, data);
    return data;
  } else {
    console.log("no data or key", data, key);
    return data;
  }
}

function decrypt(data, key) {
  data = sjcl.decrypt(key, data);
  return JSON.parse(data);
}
export default {
  name: "editor",
  components: {
    loadingScreen
  },
  data: () => ({
    loading: true,
    uid: null,
    docId: null,
    docUser: null,
    doc: false,
    docMeta: false,
    decryptedDoc: {},
    editor: false,
    opts: {
      //    debug: "info",
      modules: {},
      placeholder: "Compose an epic...",
      readOnly: false,
      theme: "snow"
    },
    initTime: null
  }),
  created() {
    const db = firebase.database();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;

        if (this.$route.params.document && this.$route.params.document) {
          this.docId = this.$route.params.document;
          this.editor = new Quill("#editor", this.opts);
          this.docUser = this.$route.params.user;
          firebase
            .database()
            .ref(`/documents/${this.docUser}/${this.docId}/`)
            .once("value", snapshot => {
              this.doc = snapshot.val();
              this.loading = false;
              this.saveHandler();
              this.decryptedDoc.data = decrypt(this.doc.data, this.docUser);
              this.editor.setContents(this.decryptedDoc.data);
              this.initTime = Date.now();
              console.log("updating");
            });
          firebase
            .database()
            .ref(`/documentMeta/${this.docUser}/${this.docId}/info`)
            .on("value", snapshot => {
              if (snapshot.val()) {
                this.docMeta = snapshot.val();
                this.loading = false;
                firebase
                  .database()
                  .ref(`/users/${this.uid}/docs/${this.docId}/`)
                  .set({
                    docId: this.docId,
                    uid: this.docUser
                  });
              } else {
                this.$router.push("/documents");
              }

              // ...
            });
          firebase
            .database()
            .ref(`/documents/${this.docUser}/${this.docId}/changes`)
            .on("child_added", data => {
              if (
                data.val().time > this.initTime &&
                data.val().uid != this.uid
              ) {
                try {
                  let delta = decrypt(data.val().delta, this.docUser);
                  this.editor.updateContents(delta);
                  console.log("dekta update");
                } catch (e) {
                  console.throw(e);
                }
              }
            });
        } else {
          this.$router.push("/documents");
        }
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    saveHandler() {
      // console.log("savehandler");
      this.editor.on("text-change", (delta, oldDelta, source) => {
        // console.log("change");
        if (source == "api") {
          // console.log("An API call triggered this change.");
        } else if (source == "user") {
          this.saveDoc(delta);
          // console.log("save", delta, oldDelta);
        }
      });
    },

    saveDoc(delta) {
      updates = [];
      let date = new Date();
      date = date.toString();
      let utcDate = new Date().getTime();
      //console.log("saving");
      let data = this.editor.getContents();
      //console.log(data, this.docUser);
      data = encrypt(data, this.docUser);
      let DocMetaRef = firebase
        .database()
        .ref(`documentMeta/${this.docUser}/${this.docId}/info`);
      let DocStorRef = firebase
        .database()
        .ref(`documents/${this.docUser}/${this.docId}/data`);
      if (delta) {
        let encDelta = encrypt(delta, this.docUser);
        let docChangeLogRef = firebase
          .database()
          .ref(`documents/${this.docUser}/${this.docId}/changes`)
          .push();
        //console.log(encDelta + " delta");
        docChangeLogRef.set({
          delta: encDelta,
          uid: this.uid,
          time: utcDate
        });
      }

      DocStorRef.set(data);
      DocMetaRef.set({
        title: this.docMeta.title,
        date: date,
        utcDate: utcDate
      });
    }
  }
};
</script>
