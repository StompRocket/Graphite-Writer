<template>
<div class="page editor">
    <loadingScreen v-if="loading"></loadingScreen>
  <br />
  <div class="container">
    <div class="box container material docInfo">
      <h1>
       <span contenteditable="true" id="docTitle">{{doc.title}}</span>
      </h1>
       <small>Last Edited: {{doc.date}}</small>
    </div>
    <quill @input="saveDoc" id="quillEditor"  ref="quill"/>
    <br />
  </div>
   
</div>
</template>
<script>
import "../assets/editor.scss";
import "../assets/quill.snow.css";
import firebase from "firebase";
import loadingScreen from "./loadingScreen.vue";
import sjcl from "../assets/sjcl.js";
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
  data = JSON.stringify(data);
  data = sjcl.encrypt(key, o);

  return data;
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
    doc: false,
    decryptedDoc: {}
  }),
  created() {
    const db = firebase.database();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;

        if (this.$route.params.document) {
          this.docId = this.$route.params.document;
          firebase
            .database()
            .ref(`/users/${this.uid}/docsStorage/${this.docId}/`)
            .on("value", snapshot => {
              this.doc = snapshot.val();
              this.loading = false;
              this.decryptedDoc.data = decrypt(this.doc.data, this.uid);
              console.log(decrypt(this.doc.data, this.uid));
              if (this.$refs.quill) {
                this.$refs.quill.editor.setContents(
                  this.decryptedDoc.data,
                  "silent"
                );
              }

              // ...
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
    saveDoc: debounce(content => {
      console.log(content);
    }, 500)
  }
};
</script>
