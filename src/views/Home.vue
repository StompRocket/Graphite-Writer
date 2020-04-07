<template>
  <div class="home page">
    <nav class="nav">
      <img class="brand--wordmark" src="@/assets/wordmark.svg">
      <form @submit.prevent class="search__form">
        <input type="text" class="input search" placeholder="Search">
      </form>
      <button class="btn new">NEW</button>
      <button :style="{background: photoURL}" class="user"></button>
    </nav>
    <div class="documents">
      <router-link :to="'/d/' + user.uid + '/' + doc.id" :key="doc.id" v-for="doc in docs" class="document" >
        <p class="title">{{doc.title}}</p>
        <p class="description">Opened: {{lastEdited(doc.opened)}}. Owner: {{doc.owner}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    data() {
      return {

      }
    },
    computed: {
      docs() {
        return this.$store.state.docs
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
        }
      })
    }

  }
</script>
