<template>
  <div class="page">
    <div class="topBar">
      <nav class="nav editor">
        <router-link to="/"><img class="brand--icon" src="@/assets/icon.svg"></router-link>

        <form @submit.prevent class="docTitle">
          <input @keyup="saveTitle" v-model="doc.title" type="text" class="input title" :placeholder="$t('docName')">

        </form>
        <p class="lastEdited nav-item">{{$t("lastEdited")}}: {{lastEdited}}</p>
        <p class="saved nav-item">{{saved ? $t("saved") :  $t("waiting")}}</p>
        <button class="nav-item" @click="print()">{{$t("print")}}</button>
        <button class="nav-item delete" @click="deleteDoc">{{$t("delete")}}</button>
        <button @click="share" class="btn share">{{$t("share")}}</button>

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
    </div>

    <div class="editor__app">
      <div class="editor__document" id="doc">

      </div>
    </div>
    <div v-if="sharingModal" class="modal_container">
      <div class="modal">
        <h3>{{$t("sharing")}}</h3>
        <div class="share_link">
          <p>{{$t("link")}}:</p>
          <input type="text" v-model="shareLink" disabled>
        </div>

        <p>{{$t("linkDesc")}}</p>
        <button @click="sharingModal = false" class="btn">{{$t("ok")}}</button>
      </div>
      <div class="modal_container" @click="sharingModal = false"></div>

    </div>
    <div v-if="error" class="modal_container">
      <div class="modal">
        <h3>{{$t("error")}}</h3>
        <p>{{$t("errorNoAccess")}}</p>
        <button @click="$router.push('/')" class="btn">{{$t("ok")}}</button>
      </div>
      <div class="modal_container" @click="$router.push('/')"></div>

    </div>
    <div v-if="!loaded" class="loading--fullscreen">
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
    </div>
  </div>
</template>

<script>
  import Quill from "quill/dist/quill.min.js"
  import JSONC from '../../jsonc.min'
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
        error: false,
        loaded: false,
        trace: this.$perf.trace('docLoad')
      }
    },
    created() {
      this.trace.start()
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      lastEdited() {
        return this.$moment.unix(this.doc.date).fromNow()
      }
    },
    methods: {
      print() {
        this.$analytics.logEvent("print")
        window.print()
      },
      deleteDoc() {
        this.$swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this file!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {

            fetch(`${this.$store.getters.api}/api/v1/documents/${this.$route.params.user}/${this.$route.params.docId}`, {
              method: "delete",
              headers: {
                "Authorization": this.$store.getters.fbToken,
                "content-type": "application/json"
              },
              body: JSON.stringify({deleteDoc: true, time: this.$moment().unix()})

            }).then(res => res.json()).then(res => {
              if (res.success) {

                this.$router.push("/")
                this.$analytics.logEvent("deletedDoc")
              }
            })
          }
        });
      },
      share() {
        this.shareLink = `https://app.graphitewriter.com/shared/${this.$store.getters.user.uid}/${this.doc["_id"]}`
        this.sharingModal = true
        let body = {shared: true, time: this.$moment().unix()}
        fetch(`${this.$store.getters.api}/api/v1/documents/${this.$route.params.user}/${this.$route.params.docId}`, {
          method: "post",
          headers: {
            "Authorization": this.$store.getters.fbToken,
            "content-type": "application/json"
          },
          body: JSON.stringify(body)

        }).then(res => res.json()).then(res => {
          if (res.success) {
            this.$analytics.logEvent("sharedDoc")
            this.saved = true
            this.doc.date = body.time
          }
        })
      },
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
            this.$analytics.logEvent("savedDoc", {doc: this.$route.params.docId, owner: this.$route.params.user})
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
        placeholder: this.$t("compose"),
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
          if (!res.error) {

            if (res.owner == this.user.uid) {
              this.doc = res
              try {
                editor.setContents(JSON.parse(this.doc.data))
              } catch {
                editor.setContents(this.doc.data)
              }
              this.loaded = true
              this.trace.stop()
              this.$analytics.logEvent("openedDoc", {doc: this.$route.params.docId, owner: this.$route.params.user})
              editor.on('text-change', (delta, oldDelta, source) => {
                if (source == 'api') {
                  //  console.log("An API call triggered this change.");
                } else if (source == 'user') {
                  // console.log("A user action triggered this change.", source, delta);
                  this.saved = false
                  window.clearTimeout(timeout)
                  timeout = window.setTimeout(() => this.save("document"), 1000)
                }
              });
            } else {
              this.loaded = true
              this.error = true
            }


          } else {
            this.loaded = true
            this.error = true
          }
        })
        //console.log( this.$store.state.token)
      })


    }
  }
</script>
