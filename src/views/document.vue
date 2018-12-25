<template>
  <main class="page document">
    <nav class="document__nav">
      <img @click="goClass" class="document__nav__logo" src="@/assets/brand/icon.svg" alt="">
      <div class="document__title">
        <h1>Wrong Triangles</h1>
        <p>All Changes Saved</p>
      </div>
      <button class="nav__new"><p>New Note</p></button>
      <button class="nav__user"></button>
    </nav>
  </main>
</template>

<script>
  import '@/assets/css/document.scss'

  export default {
    name: "document",
    methods: {
      goClass() {
        this.$router.push('/class/test')
      }
    }
  }
</script>
