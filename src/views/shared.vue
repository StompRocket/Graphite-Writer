<template>
  <div class="page">
    <nav class="nav editor">
      <router-link to="/"><img class="brand--icon" src="@/assets/icon.svg"></router-link>

      <form @submit.prevent class="docTitle">
        <input disabled v-model="doc.title" type="text" class="input title" placeholder="Document Name">

      </form>
      <p class="lastEdited nav-item">Last edited: {{lastEdited}}</p>

      <button class="nav-item">Print</button>


    </nav>


    <div class="editor__app">
      <div class="editor__document" id="doc">

      </div>
    </div>
    <div v-if="error" class="modal_container">
      <div class="modal">
        <h3>Error</h3>
       <p>You are not authorized to view this document</p>
        <button @click="$router.push('/')" class="btn">OK</button>
      </div>
      <div class="modal_container" @click="$router.push('/')"></div>

    </div>
  </div>
</template>

<script>
  import Quill from "quill/dist/quill.min.js"
  import "quill/dist/quill.core.js"
  import "quill/dist/quill.core.css"
  import "quill/dist/quill.snow.css"

  let editor
  let timeout = null
  export default {
    name: 'Editor',
    components: {},
    data() {
      return {
        doc: {},
        saved: true,
        sharingModal: false,
        shareLink: "",
        error: false
      }
    },
    computed: {
      lastEdited() {
        return this.$moment.unix(this.doc.date).fromNow()
      }
    },
    methods: {},
    mounted() {
      const options = {
        debug: 'warn',
        modules: {
          toolbar: false
        },
        theme: "snow",
        readOnly: true,
        placeholder: 'Compose an epic...',
      };

      editor = new Quill("#doc", options)
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            this.$store.commit("setToken", idToken)
            fetch(`${this.$store.getters.api}/api/v1/documents/${this.$route.params.user}/${this.$route.params.docId}`, {
              method: "get",
              headers: {
                "Authorization": this.$store.getters.fbToken
              }

            }).then(res => res.json()).then(res => {
              this.doc = res


              try {
                editor.setContents(JSON.parse(this.doc.data))
              } catch {
                editor.setContents(this.doc.data)
              }
            })
            //console.log( this.$store.state.token)
          })
        } else {

            fetch(`${this.$store.getters.api}/api/v1/documents/${this.$route.params.user}/${this.$route.params.docId}`, {
              method: "get",
              headers: {
              }

            }).then(res => res.json()).then(res => {
              if (!res.error) {

              this.doc = res


              try {
                editor.setContents(JSON.parse(this.doc.data))
              } catch {
                editor.setContents(this.doc.data)
              }
            } else {
this.error = true
              }
            })
            //console.log( this.$store.state.token)

        }
      })



    }
  }
</script>
