<template>
<div  class="page documents">
  <button @click="toggleCollections" class="button warning fab"><i class="fas fa-folder" v-if="!collectionsOpen"></i><i class="fas fa-folder-open" v-if="collectionsOpen"></i></button>

  <div  v-if="collectionsOpen" class="folder-float box material">
    <div class="container">
      <h3 style="margin-top: 0;">Your Collections: </h3>
      <button @click="newCollection" class="button warning full-width">New Collection</button>
    </div>
    <div @click="filterBy(collection)" v-bind:class="{selected: collection.key == collectionFilter }"  class="collection" v-for="collection in collections" :key="collection.key">
      <hr class="collection-rule">
      <div class="fab-container">
        <h5>{{collection.name}}</h5>
      </div>
    </div>
    

  </div>
  <loadingScreen v-if="loading"></loadingScreen>

  <div class="container">
    <br />
    <h1>Documents</h1>
    <span class="multi-input">
      <input v-model="search" class="input full-input" type="text" placeholder="Search"/>
    </span>
    <button @click="openNewDoc" class="button warning full-width">New Document</button>
    <br />
    <br />
    


    <br /> <br />
    <div class="box material deep container" v-if="noDocs">
      <h3>It looks like you have no docs.</h3>
      <br>
      <button class="button warning full-width" @click="openNewDoc">Create a new one!</button>

    </div>
    <div class="box material deep container" v-if="shareOffers">
      <h3>Shared With You:</h3>

      <button @click="openShared(doc)" class="full-width button warning" v-for="doc in shareOffers" :key="doc.docId">
      {{doc.name}}
      </button>
    </div>
    <br v-if="shareOffers" />
    <br v-if="shareOffers" />
    <router-link    v-for="doc in filterSearch" :key="doc.key" :alt="doc.doc.info.title" :to="{ name: 'editor', params: {document: doc.key, user: doc.uid} }" class="document-preview">
      <div  @contextmenu.prevent="$refs.menu.open($event, doc)" class="box material hover-deep container">
        <h3 >{{doc.doc.info.title}}</h3>
        <small>
         <i>Last Edited: {{getTimeAgo(doc.doc.info.utcDate)}}</i>
        </small>
      </div>
      <br />
    </router-link>
   <v-context ref="menu" class="context-menu">

       <ul slot-scope="child">
          <li @click="addToCollection(child)" class="context-collection">Add to collection</li>
          <li @click="remove(child)" class="context-delete">Delete</li>
       </ul>
  
   </v-context>

  </div>
  <div :class="{open: addToCollectionModal}" class="modal" id="addToCollectionModal">
    <div class="modal-context container">
      <div class="box container material deep">
        <h1>Add To Collection: </h1>
        <span class="multi-input">
          <select v-model="collectionToAdd" class="input">
            <option :name="collection.key" :key="collection.key" :value="collection.key" v-for="collection in collections">{{collection.name}}</option>
          </select>
          <button @click="addDocToCollection" class="input button warning">Add</button>
        </span>
        <br>
        <button @click="addToCollection" class="button dark">Cancel</button>
      </div>
    </div>
  </div>
</div>

</template>
<script>
import "../assets/documents.scss";
import swal from "sweetalert";
import firebase from "firebase";
import loadingScreen from "./loadingScreen.vue";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import vContext from "vue-context";
TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");
export default {
  name: "documents",
  components: {
    loadingScreen,
    vContext
  },
  data: () => ({
    newDocName: "",
    loading: true,
    uid: null,
    docs: [],
    newDoc: false,
    search: "",
    noDocs: true,
    shareOffers: false,
    collections: [],
    contextDoc: false,
    collectionsOpen: false,
    addToCollectionModal: false,
    addDoc: false,
    collectionToAdd: null,
    collectionFilter: false
  }),
  created() {
    document.title = `Graphite Writer BETA v${
      this.$parent.version
    } | Documents`;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        const db = firebase.database();

        db.ref(`users/${this.uid}/docs`).on("value", snapshot => {
          this.loading = false;

          if (!snapshot.val()) {
            this.noDocs = true;
          } else {
            this.noDocs = false;
            this.docs = [];
            snapshot.forEach(doc => {
              let docKey = doc.key;
              let utc = doc.val().utc;
              let lastOpened = doc.val().lastOpened;
              let collections = doc.val().collections;
              //console.log(utc, lastOpened, docKey);
              db
                .ref(`documentMeta/${doc.val().uid}/${doc.val().docId}`)
                .once("value")
                .then(docMeta => {
                  // console.log(docMeta.val());
                  this.docs.unshift({
                    doc: docMeta.val(),
                    key: docKey,
                    uid: doc.val().uid,
                    collections: collections
                  });

                  // ...
                });

              // ...
            });
          }
        });
        db.ref(`users/${this.uid}/collections`).on("value", snapshot => {
          this.collections = snapshot.val();
        });
        db.ref(`users/${this.uid}/shareOffers`).on("value", snapshot => {
          if (!snapshot.val()) {
            this.shareOffers = false;
          } else {
            this.shareOffers = [];
            snapshot.forEach(doc => {
              let docKey = doc.key;

              this.shareOffers.push({
                name: doc.val().name,
                docId: doc.val().docId,
                docUser: doc.val().docUser
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
  computed: {
    sortedDocs: function() {
      function compare(a, b) {
        if (a.doc.info.utcDate > b.doc.info.utcDate) return -1;
        if (a.doc.info.utcDate < b.doc.info.utcDate) return 1;
        return 0;
      }

      return this.docs.sort(compare);
    },
    filterSearch() {
      let query = this.search.toLowerCase();
      let result = this.sortedDocs;
      if (this.collectionFilter) {
        const collectionFilter = doc => {
          if (doc.collections) {
            if (doc.collections[this.collectionFilter]) {
              return true;
            }
          }
        };
        result = result.filter(collectionFilter);
      }
      if (!query) {
        return result;
      } else {
        const filter = docs => {
          if (JSON.stringify(docs.doc.info.title)) {
            return JSON.stringify(docs.doc.info.title)
              .toLowerCase()
              .includes(query);
          }
        };

        return result.filter(filter);
      }
    }
  },
  methods: {
    filterBy(collection) {
      if (this.collectionFilter == collection.key) {
        this.collectionFilter = false;
      } else {
        this.collectionFilter = collection.key;
      }
    },

    addDocToCollection() {
      let docId = this.addDoc.userData.key;
      let userId = this.addDoc.userData.uid;
      let collectionKey = this.collectionToAdd;
      firebase
        .database()
        .ref(`users/${this.uid}/docs/${docId}/collections/${collectionKey}`)
        .set({ key: collectionKey });

      this.addToCollectionModal = false;
    },
    newCollection() {
      swal("New Collection Name:", {
        className: "swal-modal",
        content: "input"
      }).then(name => {
        if (name) {
          if (/^\s+$/.test(name)) {
            name = "Untitled";
          }
          let newCollectionRef = firebase
            .database()
            .ref(`/users/${this.uid}/collections/`)
            .push();
          newCollectionRef.set({
            name: name,
            key: newCollectionRef.key
          });
        }
      });
    },
    toggleCollections() {
      if (this.collectionsOpen) {
        this.collectionsOpen = false;
      } else {
        this.collectionsOpen = true;
      }
    },
    remove(doc) {
      swal({
        title: "Are you sure?",
        text: `You are about to remove this document from your library`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          firebase
            .database()
            .ref(`users/${this.uid}/docs/${doc.userData.key}`)
            .remove()
            .then(err => {
              swal({
                text: "Removed from your library",
                icon: "success"
              });
            });
        }
      });
    },
    addToCollection(doc) {
      this.addDoc = doc;
      if (this.addToCollectionModal) {
        this.addToCollectionModal = false;
      } else {
        this.addToCollectionModal = true;
      }
    },
    getTimeAgo(date) {
      return timeAgo.format(date);
    },
    openShared(doc) {
      firebase
        .database()
        .ref(`users/${this.uid}/shareOffers/${doc.docId}`)
        .remove();

      this.$router.push({
        name: "editor",
        params: { document: doc.docId, user: doc.docUser }
      });
    },
    openNewDoc() {
      swal("New Document Name:", {
        className: "swal-modal",
        content: "input"
      }).then(name => {
        if (name) {
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
          newDocStorRef.set({
            data: ""
          });
        }
      });
    }
  }
};
</script>
