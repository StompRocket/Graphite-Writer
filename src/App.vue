<template>
  <div @click="checkFocus" id="app">
    <nav v-if="$route.name != 'note'" class="app__nav">
      <img @click="home" class="nav__logo" src="@/assets/brand/_wordmarkWhite.svg" alt="Graphite Writer">
      <input type="text" class="nav__search" placeholder="Search">
      <button class="nav__new">New Note</button>
      <button @click="showUser" class="nav__user"></button>

    </nav>

    <div class="app__placeHolder" v-if="$route.name == 'note'"></div>
    <div @click="prevent = true" v-if="showUserCard" :style="{position: positionStyle }" class="app__user">
      Test
    </div>
    <router-view/>
    <footer class="app__footer">
      <p>Graphite Writer is a passion project created by <a href="https://brainstormincstudio.com" target="_blank">Ronan
        F</a> and Sasha S @ <a href="https://stomprocket.io" target="_blank">Stomp Rocket</a></p>
      <p>Contribute to Graphite Writers development on our <a target="_blank"
                                                              href="https://github.com/StompRocket/Graphite-Writer">github</a>
      </p>
      <small>Graphite Writer is an open source project licenced under Apache 2.0. By Using Graphite Writer you consent
        to our terms of use. Graphite Writer and its owners aren't responsible for any data loss.
      </small>
      <p>v{{version}}</p>
    </footer>

  </div>
</template>

<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'

  export default {
    name: 'appContainer',
    data() {
      return {
        version: require('../package.json').version,
        showUserCard: false,
        prevent: false
      }
    },
    methods: {
      showUser(opt) {
        this.showUserCard = !this.showUserCard;
        this.prevent = true;
      },
      checkFocus() {
        if (this.showUserCard && !this.prevent) {
          this.showUserCard = false
        } else {
          this.prevent = false
        }
      },
      home() {
        this.$router.push('/')
      }
    },
    computed: {
      positionStyle() {
        if (this.$route.name != 'note') {
          return 'absolute'
        } else {
          return 'fixed'
        }
      }

    }
  }
</script>
