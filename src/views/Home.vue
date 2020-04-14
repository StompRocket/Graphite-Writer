<template>
  <div class="home page">
    <nav class="nav">
      <img class="brand--wordmark" src="@/assets/wordmark.svg">
      <form @submit.prevent class="search__form">
        <input v-model="search" type="text" class="input search" placeholder="Search">
      </form>
      <button class="btn new" @click="newDoc">NEW</button>
      <img @click="accountInfo = !accountInfo" :src="$store.getters.user.photoURL" class="user" alt="">
    </nav>
    <div v-if="accountInfo" class="accountButton">
      <p>{{user.email}}</p>
      <button class="btn" @click="logOut">Logout</button>
    </div>
    <div v-if="!docsLoaded" class="loading">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      <img src="@/assets/wordmark.svg" alt="">
      <p class="version">v{{version}}</p>
    </div>
    <div class="documents">

      <router-link :to="openUrl(doc)" :key="doc.id" v-for="doc in filteredDocs" class="document">
        <p class="title">{{doc.title}}</p>
        <p class="description">Opened: {{lastEdited(doc.opened)}}. Owner: {{doc.owner}}</p>
      </router-link>
      <div v-if="docs.length <= 0 && docsLoaded" class="noDocs">
        <img src="../assets/undraw_files_6b3d.svg" alt="No Documents">
        <h3>No docs</h3>
        <p>You don't have any documents yet. Press new on the top right of your screen to create one.</p>
      </div>
    </div>
  </div>
</template>

<script>
  let timeout = null
  export default {
    name: 'Home',
    data() {
      return {
        search: "",
        loaded: false,
        accountInfo: false,
        version: require("../../package.json").version
      }
    },
    computed: {
      docsLoaded() {
        return this.$store.state.docsLoaded
      },
      docs() {
        if (this.$store.getters.userDocs.length > 0) {
          this.$analytics.setUserProperties({docCount: this.$store.getters.userDocs.length});
        }

        return this.$store.getters.userDocs
      },
      filteredDocs() {
        if (this.search.length <= 0) {
          return this.$store.state.docs
        } else {
          return this.$store.state.docs.filter(i => {
            clearTimeout(timeout)
            timeout = setTimeout(this.logSearch, 1000)
            return i.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
        }
      },
      photoURL() {
        return `url(${this.$store.state.user.photoURL}) no-repeat center center`
      },
      user() {
        return this.$store.state.user
      },

    },
    methods: {
      openUrl (doc) {
        if (doc.sharedDoc) {
          return '/shared/' + this.user.uid + '/' + doc.id
        } else {
          return '/d/' + this.user.uid + '/' + doc.id
        }
      },
      logSearch() {
        console.log("Log search")
        timeout = null
        this.$analytics.logEvent("searching")
      },
      logOut() {
        this.$analytics.logEvent("logout")
        this.$firebase.auth().signOut().then(() => {
          window.location.href = "https://graphitewriter.com"
        })
      },
      lastEdited(time) {

        return this.$moment.unix(time).fromNow()
      },
      newDoc() {
        swal("New Doc Name:", {
          content: "input",
        })
        .then((value) => {
          if (!value || value.length <= 0) {
            value = "Untitled"
          }
          fetch(`${this.$store.getters.api}/api/v1/documents/new`, {
            method: "post",
            headers: {
              "Authorization": this.$store.getters.fbToken,
              "content-type": "application/json"
            },
            body: JSON.stringify({title: value, time: this.$moment().unix()})

          }).then(res => res.json()).then(res => {
            if (res.success) {
              this.$analytics.logEvent("newDoc")
              this.$router.push(`/d/${this.$store.getters.user.uid}/${res.id}`)
            }
          })
        });
      }
    },
    components: {},
    mounted() {
      this.$analytics.logEvent("openedDocumentsPage")
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {

          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit("setToken", idToken)
            this.$store.dispatch("fetchDocs")
            this.loaded = true
            //console.log( this.$store.state.token)
          })
        } else {
          this.$store.commit("setUser", false)
          this.$analytics.logEvent("login")
          // No user is signed in.
          console.log(this.$route.name)
          if (this.$route.name != "Share") {

            var provider = new this.$firebase.auth.GoogleAuthProvider();
            this.$firebase.auth().signInWithRedirect(provider);
          }
        }
      })
    }

  }
</script>
