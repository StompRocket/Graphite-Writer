<template>
  <div @click="checkFocus" id="app">
    <nav v-if="$route.name != 'note'" class="app__nav">
      <img @click="home" class="nav__logo" src="@/assets/brand/_wordmarkWhite.svg" alt="Graphite Writer">
      <input type="text" class="nav__search" placeholder="Search">
      <div :class="{active: showUserHover}" class="nav__userContainer">
        <button @mouseleave="userDoneHover" @mouseover="userHover" :style="{ 'background-image' : 'url(\'' + user.image + '\')' }" @click="showUser"
                class="nav__user"></button>
      </div>

    </nav>
    <div class="app__placeHolder" v-if="$route.name == 'note'"></div>
    <div @click="prevent = true" v-if="showUserCard" :style="{position: positionStyle }" class="app__user">
      <div class="user__card">
        <img :src="user.image" alt="User image">
        <div>
          <h1>{{user.name}}</h1>
          <p>{{user.email}}</p>
        </div>

      </div>
      <button @click="logout">Logout</button>
    </div>
    <loader id="loader" v-if="loading"/>
    <router-view/>
    <appFooter/>
  </div>
</template>

<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'
  import appFooter from '@/components/footer.vue'
  import loader from '@/components/loader.vue'
  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    name: 'appContainer',
    components: {appFooter, loader},
    data() {
      return {
        version: require('../package.json').version,
        showUserCard: false,
        prevent: false,
        loading: true,
        preventLogin: false,
        showUserHover: false,
        user: {
          uid: null,
          name: null,
          email: null,
          image: null
        }
      }
    },
    mounted() {
      let google = new firebase.auth.GoogleAuthProvider();
      this.loading = true;
      firebase.auth().onAuthStateChanged(user => {
        if (user) {

          this.user = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL
          }
        } else if (localStorage.getItem('preventLogin') !== 'true') {
          this.loading = true;
          firebase.auth().signInWithRedirect(google)
        } else if (localStorage.getItem('preventLogin') === 'true') {
          localStorage.setItem('preventLogin', 'false');
          window.location = 'https://graphitewriter.com'
        }
      })
    },
    methods: {
      userDoneHover() {
        if (!this.showUserCard) {
          this.showUserHover = false;
        }

      },
      userHover() {
        this.showUserHover = true;
      },
      logout() {
        this.showUserCard = false;
        this.preventLogin = true;
        localStorage.setItem('preventLogin', 'true');
        firebase.auth().signOut();
        window.location = 'https://graphitewriter.com'
      },
      showUser() {
        this.showUserCard = !this.showUserCard;
        if (this.showUserCard) {
          this.showUserHover = true;
        } else {
          this.showUserHover = false;
        }
        this.prevent = true;
      },
      checkFocus() {
        if (this.showUserCard && !this.prevent) {
          this.showUserCard = false
          this.showUserHover =  false;
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
