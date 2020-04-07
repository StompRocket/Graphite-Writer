<template>
  <div class="page">
    <nav class="nav editor">
      <router-link to="/"><img class="brand--icon" src="@/assets/icon.svg"></router-link>

      <form @submit.prevent class="docTitle">
        <input @keyup="saveTitle" v-model="doc.title" type="text" class="input title" placeholder="Document Name">

      </form>
      <p class="lastEdited nav-item">Last edited: {{lastEdited}}</p>
      <p class="saved nav-item">{{saved ? "saved" : "waiting"}}</p>
      <button class="nav-item">Print</button>
      <button class="nav-item delete">Delete</button>
      <button class="btn share">SHARE</button>

    </nav>


    <div id="toolbar">
      <!-- Add font size dropdown -->
      <select class="ql-size">
        <option value="small"></option>
        <!-- Note a missing, thus falsy value, is used to reset to default -->
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <!-- Add a bold button -->
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <span class="ql-formats">
         <button type="button" class="ql-indent" value="-1"></button>
         <button type="button" class="ql-indent" value="+1"></button>
         <select class="ql-align">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
         </select>
         <button type="button" class="ql-direction" value="rtl"></button>
         <button type="button" class="ql-list" value="ordered"></button>
         <button type="button" class="ql-list" value="bullet"></button>
      </span>
      <span class="ql-formats">
         <button type="button" class="ql-image"></button>
         <button type="button" class="ql-code-block"></button>
         <button type="button" class="ql-script" value="sub"></button>
         <button type="button" class="ql-script" value="super"></button>
         <button type="button" class="ql-clean"></button>
      </span>
      <!-- Add subscript and superscript buttons -->

    </div>
    <div class="editor__app">
      <div class="editor__document" id="doc">

      </div>
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
        saved: true
      }
    },
    computed: {
      lastEdited() {
        return this.$moment.unix(this.doc.date).fromNow()
      }
    },
    methods: {
      save(type) {
        //console.log(timeout, "saving")
        timeout = null
        this.saved = true
        let body
        switch (type) {
          case "title":
            body = {title: this.doc.title, time: this.$moment().unix()}
            break;
          case "document":
            var delta = editor.getContents()
            body = {data: delta, time: this.$moment().unix()}
            break
          default:
            var delta = editor.getContents()
            body = {title: this.doc.title, data: delta, time: this.$moment().unix()}
        }
        fetch(`${this.$store.getters.api}/api/v1/documents/${this.$route.params.user}/${this.$route.params.docId}`, {
          method: "post",
          headers: {
            "Authorization": this.$store.getters.fbToken,
            "content-type": "application/json"
          },
          body: JSON.stringify(body)

        }).then(res => res.json()).then(res => {
          if (res.success) {
            this.saved = true
            this.doc.date = body.time
          }
        })

      },
      saveTitle() {
        this.saved = false
        window.clearTimeout(timeout)
        timeout = window.setTimeout(() => this.save("title"), 1000)

      }
    },
    mounted() {
      const options = {
        debug: 'warn',
        modules: {
          toolbar: "#toolbar"
        },
        theme: "snow",
        placeholder: 'Compose an epic...',
      };

      editor = new Quill("#doc", options)
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
          editor.on('text-change',  (delta, oldDelta, source) => {
            if (source == 'api') {
            //  console.log("An API call triggered this change.");
            } else if (source == 'user') {
             // console.log("A user action triggered this change.", source, delta);
              this.saved = false
              window.clearTimeout(timeout)
              timeout = window.setTimeout(() => this.save("document"), 1000)
            }
          });
        })
        //console.log( this.$store.state.token)
      })


    }
  }
</script>
