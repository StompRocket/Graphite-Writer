<template>
<div class="page editor">
    <loadingScreen v-if="loading"></loadingScreen>
  <br />
  <div class="container">
    <div class="box container material docInfo">
      <span class="multi-input">
        <input @keydown="saveDoc()" :disabled="opts.readOnly" id="docTitle" v-model="docMeta.title" type="text" class="input title-input" autocomplete="off">
      </span>
      <p v-if="opts.readOnly">Read Only</p>
      <div class="share-row">
        <div class="share-col">
          <button  @click="remove" class="button issue"><i class="fas fa-trash"></i>
        </button>
        </div>
        <div class="share-col">
          <element class="user" v-for="user in currentUsers" :key="user.uid">
            <img :src="user.image" :alt="user.name" class="round-profile share-item" v-tooltip="user.name">
          </element>
          &nbsp;
          <button v-if="!opts.readOnly" @click="share" class="button dark input share-button"><i class="fas fa-users large-icon"></i></button>
        </div>
      </div>
      <small v-if="!loading" class="last-edited">Last Edited: {{getTimeAgo(docMeta.utcDate)}}</small>
    </div>
    <br />
    <div id="toolbar"></div>
    <div id="editor"></div>
  </div>
  <div class="share-modal-container">
    <div v-bind:class="{open: shareSettings}" class="modal share-modal-container">
      <div class="modal-contents share-modal">
        <div class="box material container">
          <h1>Share</h1>
          <h3>Shareable Link (view only)</h3>
          <a>https://beta.graphitewriter.com/#/s/{{shareUrl}}</a>

      
          <div class="collaberatorsContainer">
                <h3>Collaberators</h3>
            <i class="user" v-for="user in users" :key="user.uid"  >
              <img :src="user.profile_picture" :alt="user.name" class="round-profile big" @click="removeUser(user)" v-tooltip="{content: user.name, placement: 'bottom-center'}" >
              &nbsp;
            </i>
          </div>
          <form @submit.prevent="shareWithPerson" class="multi-input">
            <input id="shareAdd" v-model="personToShareWith" type="email" placeholder="Add a collaberator" class="input">
            <button type="submit" class="input button dark">Add</button>
          </form>
          <p >{{shareError}}</p>
          <br>
          <button @click="closeSave" class="button warning">Done</button>
        </div>
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
import MagicUrl from "quill-magic-url";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");
Quill.register("modules/magicUrl", MagicUrl);
const FontAttributor = Quill.import("attributors/class/font");
const Hashids = require("hashids");
let hashids = new Hashids();
let typingTimer; //timer identifier
let doneTypingInterval = 5000;
let updates = [];
const Clipboard = Quill.import("modules/clipboard");
FontAttributor.whitelist = ["roboto", "Serif", "Sans Serif"];
Quill.register(FontAttributor, true);
class MyClipboard extends Clipboard {
  onPaste(e) {
    var wrapper = document.querySelector("#editor-wrapper");
    var scrollTop = wrapper.scrollTop;
    super.onPaste(e);
    setTimeout(function() {
      wrapper.scrollTop = scrollTop;
    }, 10);
  }
}

Quill.register("modules/clipboard", MyClipboard, true);

const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "link", "code-block", "image"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [
    {
      align: []
    }
  ],
  [{ direction: "rtl" }], // text direction

  ["clean"] // remove formatting button
];
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
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
function encodeEmail(email) {
  let encodedEmail = encodeURIComponent(email);
  encodedEmail = encodedEmail.replace(/\./g, "%dot");
  return encodedEmail;
}
function decodeEmail(email) {
  let encodedEmail = email.replace(/%dot/g, ".");
  encodedEmail = decodeURIComponent(email);

  return encodedEmail;
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
      modules: {
        toolbar: toolbarOptions,
        magicUrl: true
      },
      placeholder: "Compose an epic...",
      readOnly: false,
      theme: "snow"
    },
    initTime: null,
    shareSettings: false,
    users: [],
    shareUrl: null,
    realTimeId: null,
    personToShareWith: null,
    shareError: null,
    currentUsers: [],
    user: null
  }),
  created() {
    const startLoad = performance.now();
    const db = firebase.database();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
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
                if (this.editor == false) {
                  this.editor = new Quill("#editor", this.opts);
                }

                //   console.log("i can write");
              } else {
                this.opts.readOnly = true;
                // console.log("i cant write");
                if (this.editor == false) {
                  this.editor = new Quill("#editor", this.opts);
                }
              }
              this.users = [];
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
              firebase
                .database()
                .ref(
                  `/documentMeta/${this.docUser}/${this.docId}/currentUsers/${
                    this.uid
                  }`
                )
                .set({
                  uid: this.uid,
                  image: firebase.auth().currentUser.photoURL,
                  name: firebase.auth().currentUser.displayName
                });
              firebase
                .database()
                .ref(
                  `/documentMeta/${this.docUser}/${this.docId}/currentUsers/${
                    this.uid
                  }`
                )
                .onDisconnect()
                .remove();
              firebase
                .database()
                .ref(`/documentMeta/${this.docUser}/${this.docId}/currentUsers`)
                .on("value", data => {
                  this.currentUsers = data.val();
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
                document.title = `Graphite Writer BETA v${this.$parent.version} | ${this.docMeta.title}`
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
  beforeRouteLeave: function(to, from, next) {
    firebase
      .database()
      .ref(
        `/documentMeta/${this.docUser}/${this.docId}/currentUsers/${this.uid}`
      )
      .remove();
    firebase
      .database()
      .ref(`/documents/${this.docUser}/${this.docId}/changes`)
      .off();
    firebase
      .database()
      .ref(`/documentMeta/${this.docUser}/${this.docId}/info`)
      .off();
    firebase
      .database()
      .ref(`/documentMeta/${this.docUser}/${this.docId}/currentUsers`)
      .off();
    firebase
      .database()
      .ref(`/documentMeta/${this.docUser}/${this.docId}/cursors/${this.uid}`)
      .remove();
    next();
  },

  methods: {
    removeUser(user) {
      this.closeSave();
      swal({
        title: "Are you sure?",
        text: `You are about to remove acess for ${user.name} to this document`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          firebase
            .database()
            .ref(
              `/documentMeta/${this.docUser}/${this.docId}/users/${user.uid}`
            )
            .remove();
          swal(`${user.name} has been removed`, {
            icon: "success"
          });
        }
      });
    },
    getTimeAgo(date) {
      if (date) {
        return timeAgo.format(date);
      }
    },
    shareWithPerson() {
      if (validateEmail(this.personToShareWith)) {
        let encodedEmail = encodeEmail(this.personToShareWith);
        console.log(encodedEmail);

        firebase
          .database()
          .ref(`userDB/byEmail/${encodedEmail}`)
          .once("value", snapshot => {
            if (snapshot.val()) {
              let shareUID = snapshot.val().uid;
              firebase
                .database()
                .ref(
                  `/documentMeta/${this.docUser}/${
                    this.docId
                  }/users/${shareUID}`
                )
                .set(snapshot.val().uid);
              firebase
                .database()
                .ref(`/users/${shareUID}/shareOffers/${this.docId}`)
                .set({
                  name: this.docMeta.title,
                  docId: this.docId,
                  docUser: this.docUser
                });
              this.personToShareWith = null;
              this.shareError = null;
            } else {
              this.shareError = "Not a user of Graphite Wirter";
            }
          });
      } else {
        this.shareError = "Not a valid email";
      }
    },
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
      this.editor.on("selection-change", (range, oldRange, source) => {
        if (range) {
          firebase
            .database()
            .ref(
              `/documentMeta/${this.docUser}/${this.docId}/cursors/${this.uid}`
            )
            .set({
              uid: this.uid,
              name: this.user.displayName,
              range: range
            });
        } else {
          console.log("Cursor not in the editor");
          firebase
            .database()
            .ref(
              `/documentMeta/${this.docUser}/${this.docId}/cursors/${this.uid}`
            )
            .remove();
        }
      });

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
