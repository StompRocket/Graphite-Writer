<template>
<div class="page editor">
    <loadingScreen v-if="loading"></loadingScreen>
  <br />
  <div class="container">
    <div class="box container material docInfo">
      <input @input="saveDoc()" :disabled="opts.readOnly" id="docTitle" v-model="docMeta.title" type="text">
      <p v-if="opts.readOnly">Read Only</p>
      <button v-if="!opts.readOnly" @click="share">Share</button>
       <button  @click="remove">Remove From Library</button>
       <p>Last Edited: {{docMeta.date}}</p>
    </div>
    <br />
    <div id="toolbar"></div>
    <div id="editor"></div>
  </div>
  <div v-bind:class="{open: shareSettings}" class="modal">
    <div class="modal-contents container">
      <div class="box material">
        <button @click="closeSave">Close</button>
<h1>Share</h1>
<hr>
<h3>Shareable Link (view only)</h3>
<a>https://beta.graphitewriter.com/#/s/{{shareUrl}}</a>

<h3>Collaberators</h3>
<div>
  <div class="user" v-for="user in users" :key="user.uid">
    <img :src="user.profile_picture" :alt="user.name">
    <h4>{{user.name}}</h4>
  </div>
</div>
<form @submit.prevent>
  <input type="email" placeholder="Add an collaberator">
  <button type="submit">Add</button>
</form>
<br>
 <button @click="closeSave">Done</button>
      </div>
    </div>
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
import swal from "sweetalert";

const Hashids = require("hashids");
let hashids = new Hashids();
let typingTimer; //timer identifier
let doneTypingInterval = 5000;
let updates = [];
String.prototype.hashCode = function() {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
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
  if (data && key) {
    data = sjcl.decrypt(key, data);
    return JSON.parse(data);
  } else {
    console.log("no data or key", data, key);
    return data;
  }
}
function hash(data) {
  //console.log(data);
  let result = data.hashCode();
  // console.log(result);
  result = String(result);
  //console.log(result);
  result = result.replace("-", "");
  //console.log(result);
  result = Number(result);
  //console.log(result);
  result = hashids.encode(result);
  return result;
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
    initTime: null,
    shareSettings: false,
    users: [],
    shareUrl: null,
    realTimeId: null
  }),
  created() {
    const startLoad = performance.now();
    const db = firebase.database();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;

        if (this.$route.params.document && this.$route.params.document) {
          this.docId = this.$route.params.document;
          this.docUser = this.$route.params.user;
          this.realTimeId = guid();
          firebase
            .database()
            .ref(`/documentMeta/${this.docUser}/${this.docId}/users`)
            .on("value", snapshot => {
              //  console.log(snapshot.val(), this.uid);
              if (snapshot.val()[this.uid]) {
                this.editor = new Quill("#editor", this.opts);
                //   console.log("i can write");
              } else {
                this.opts.readOnly = true;
                // console.log("i cant write");
                this.editor = new Quill("#editor", this.opts);
              }
              snapshot.forEach(user => {
                firebase
                  .database()
                  .ref("/users/" + user.val() + "/publicInfo")
                  .once("value")
                  .then(snapshot => {
                    this.users.push(snapshot.val());
                  });
              });
            });
          firebase
            .database()
            .ref(`/documents/${this.docUser}/${this.docId}/data`)
            .once("value", snapshot => {
              this.doc = snapshot.val();
              this.loading = false;
              this.saveHandler();
              this.decryptedDoc.data = decrypt(this.doc, this.docUser);
              this.editor.setContents(this.decryptedDoc.data);
              this.initTime = Date.now();
              const endLoad = performance.now();
              firebase
                .database()
                .ref(`/analytics/loadTimes/`)
                .push()
                .set({
                  docId: this.docId,
                  uid: this.docUser,
                  utc: new Date().getTime(),
                  uid: this.uid,
                  startLoad: startLoad,
                  endLoad: endLoad,
                  time: endLoad - startLoad,
                  page: "documents"
                });
              console.log(endLoad - startLoad + " loaded");
            });
          firebase
            .database()
            .ref(`/documentMeta/${this.docUser}/${this.docId}/info`)
            .on("value", snapshot => {
              if (snapshot.val()) {
                this.docMeta = snapshot.val();
                let date = new Date();
                date = date.toString();
                firebase
                  .database()
                  .ref(`/users/${this.uid}/docs/${this.docId}/`)
                  .set({
                    docId: this.docId,
                    uid: this.docUser,
                    utc: new Date().getTime(),
                    lastOpened: date
                  });
              } else {
                this.$router.push("/documents");
              }

              // ...
            });
          firebase
            .database()
            .ref(`/documents/${this.docUser}/${this.docId}/changes`)
            .limitToLast(5)
            .on("child_added", data => {
              if (
                data.val().time > this.initTime &&
                data.val().realTimeId != this.realTimeId
              ) {
                let delta = decrypt(data.val().delta, this.docUser);
                this.editor.updateContents(delta);
                // console.log("dekta update");
              } else {
                // console.log("comit from my self");
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
    remove() {
      firebase
        .database()
        .ref(`users/${this.uid}/docs/${this.docId}`)
        .remove()
        .then(() => {
          swal("Removed from your library");
        });
    },
    closeSave() {
      this.shareSettings = false;
    },
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
    share() {
      let user = hash(this.docUser);
      let doc = hash(this.docId);
      this.shareUrl = `${user}/${doc}`;
      this.shareSettings = true;
      firebase
        .database()
        .ref(`refs/${user}/${doc}/`)
        .set({
          docUser: this.docUser,
          docId: this.docId
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
          time: utcDate,
          realTimeId: this.realTimeId
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
