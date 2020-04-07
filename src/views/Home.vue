<template>
  <div class="home page">
    <nav class="nav">
      <img class="brand--wordmark" src="@/assets/wordmark.svg">
      <form @submit.prevent class="search__form">
        <input v-model="search" type="text" class="input search" placeholder="Search">
      </form>
      <button class="btn new" @click="newDoc">NEW</button>
      <img :src="$store.getters.user.photoURL" class="user" alt="">
    </nav>
    <div class="documents">
      <router-link :to="'/d/' + user.uid + '/' + doc.id" :key="doc.id" v-for="doc in filteredDocs" class="document">
        <p class="title">{{doc.title}}</p>
        <p class="description">Opened: {{lastEdited(doc.opened)}}. Owner: {{doc.owner}}</p>
      </router-link>
      <div v-if="docs.length <= 0">
        <p>No docs</p>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    data() {
      return {
        search: ""
      }
    },
    computed: {
      docs() {
        return this.$store.state.docs
      },
      filteredDocs() {
        if (this.search.length <= 0) {
          return this.$store.state.docs
        } else {
          return this.$store.state.docs.filter(i => {
         return   i.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
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
      lastEdited(time) {

        return this.$moment.unix(time).fromNow()
      },
      newDoc() {
        swal("New Doc Name:", {
          content: "input",
        })
        .then((value) => {
          if (value.length <= 0) {
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
            this.$router.push(`/d/${this.$store.getters.user.uid}/${res.id}`)
            }
          })
        });
      }
    },
    components: {},
    mounted() {
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {

          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit("setToken", idToken)
            this.$store.dispatch("fetchDocs")
            //console.log( this.$store.state.token)
          })
        } else {
          this.$store.commit("setUser", false)
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
