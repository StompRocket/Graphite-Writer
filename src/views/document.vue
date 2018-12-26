<template>
  <main class="page document">
    <nav class="document__nav">
      <img @click="goClass" class="document__nav__logo" src="@/assets/brand/icon.svg" alt="">
      <div class="document__title">
        <h1>{{noteMeta.name}}</h1>
        <p>{{timeMessage}}</p>
      </div>
      <button class="nav__new">New Note</button>
      <button :style="{ 'background-image' : 'url(\'' + $parent.user.image + '\')' }" @click="$parent.showUser"
              class="nav__user"></button>
    </nav>
    <div id="editor">

    </div>
  </main>
</template>

<script>
  import '@/assets/css/document.scss'
  import Quill from 'quill'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.bubble.css'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import moment from 'moment'

  const options = {
    placeholder: ' Compose an epic...',

    readOnly: false,
    theme: 'bubble',
    scrollingContainer: 'html'
  };
  export default {
    name: "document",
    data() {
      return {
        uid: false,
        noteMeta: false,
        timeMessage: ''
      }
    },
    methods: {
      goClass() {
        this.$router.push(`/class/${this.uid}/${this.$route.params.class}`)
      }
    },
    mounted() {
      this.$parent.loading = true
      let editor = new Quill('#editor', options)
      firebase.auth().onAuthStateChanged(user => {
        this.uid = user.uid
        firebase.database().ref(`/notesMeta/${this.$route.params.id}`).once('value').then(data => {
          console.log(data.val())
          this.noteMeta = data.val()
          this.timeMessage = `Last Edited: ${moment(this.noteMeta.lastEdited).fromNow()}`

        })
        firebase.database().ref(`/noteData/${this.$route.params.id}`).once('value').then(data => {
          console.log(data.val().data)
          editor.setContents(data.val().data)
          this.$parent.loading = false;
          editor.on('text-change', (delta, oldDelta, source) => {
            if (source == 'api') {

            } else if (source == 'user') {
              let newNoteData = editor.getContents()
              let timeStamp = moment().toJSON()
              firebase.database().ref(`/noteData/${this.$route.params.id}/data`).set(newNoteData)
              firebase.database().ref(`/notesMeta/${this.$route.params.id}/lastEdited`).set(timeStamp)
              this.timeMessage = 'All Changes Saved'
            }
          });
        })
      })


    }
  }
</script>
