<template>
  <main class="page document">
    <nav class="document__nav">
      <img @click="goClass" class="document__nav__logo" src="@/assets/brand/icon.svg" alt="">
      <div class="document__title">
        <h1>Wrong Triangles</h1>
        <p>All Changes Saved</p>
      </div>
      <button class="nav__new">New Note</button>
      <button @click="$parent.showUser" class="nav__user"></button>
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

  const options = {
    placeholder: ' Compose an epic...',
    debug: 'info',
    readOnly: false,
    theme: 'bubble',
    scrollingContainer: 'html'
  };
  export default {
    name: "document",

    methods: {
      goClass() {
        this.$router.push('/class/test')
      }
    },
    mounted() {
      let editor = new Quill('#editor', options)

    }
  }
</script>
