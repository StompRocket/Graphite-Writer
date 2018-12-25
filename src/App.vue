<template>
  <div id="app">
    <nav class="app__nav">
      <img @click="home" class="nav__logo" src="@/assets/brand/_wordmarkWhite.svg" alt="Graphite Writer">
      <input type="text" class="nav__search" placeholder="Search">
      <button class="nav__new"><p>New Note</p></button>
      <button class="nav__user"></button>
    </nav>
    <router-view/>
    <footer class="app__footer">
      <p>Graphite Writer is a passion project created by <a href="https://brainstormincstudio.com" target="_blank">Ronan F</a> and Sasha S @ <a href="https://stomprocket.io" target="_blank">Stomp Rocket</a></p>
      <p>Contribute to Graphite Writers development on our <a target="_blank" href="https://github.com/StompRocket/Graphite-Writer">github</a></p>
      <small>Graphite Writer is an open source project licenced under Apache 2.0. By Using Graphite Writer you consent to our terms of use. Graphite Writer and its owners aren't responsible for any data loss.</small>
    </footer>
  </div>
</template>

<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'

  export default {
    name: 'appContainer',
    methods: {
      home() {
        this.$router.push('/')
      }
    }
  }
</script>
