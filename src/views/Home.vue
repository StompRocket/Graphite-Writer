<template>
  <div class="home page">
    <nav class="nav">
      <router-link to="/">
        <img class="brand--wordmark" src="@/assets/wordmark.svg"/>
      </router-link>

      <form @submit.prevent class="search__form">
        <input
            v-model="search"
            type="text"
            class="input search"
            :placeholder="$t('search')"
        />
      </form>
      <button class="btn new" @click="newDoc">{{ $t('new') }}</button>
      <Locale v-if="prominentLocale"></Locale>

      <router-link to="/settings"><img

          :src="$store.getters.user.photoURL"
          class="user"
          alt=""
      /></router-link>
    </nav>
    <div v-if="$store.getters.feedback" class="feedBackBar">
      <div class="container">
        <p>Do you Have Feedback?</p>
        <button class="btn--dark" @click="feedBack()">Tell us what you think</button>
      </div>

    </div>
    <div v-if="!docsLoaded" class="loading">
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
      <img src="@/assets/wordmark.svg" alt=""/>
      <p class="version">v{{ version }}</p>
    </div>
    <section v-if="collectionsEnabled && docsLoaded && docs.length > 0" class="home__section">
      <h3>Collections</h3>
      <div class="collections">
        <div :key="collection.id"
             v-for="collection in collections" class="collection__container">

          <router-link :to="'/collection/'+ collection.id" class="collection">
            <i class="fas fa-bookmark"></i>
            <div class="text">
              <p class="title">{{collection.title}}</p>
              <p class="description">
                {{$t("docs")}}: {{collection.docs.length}}
              </p>
            </div>
          </router-link>

        </div>


      </div>
      <div v-if="collectionsCount == 0" class="collections__onboarding">
        <p>{{$t("collections.youHaveNone")}}</p>
        <p>{{$t("collections.instructions")}}</p>
        <br>
        <p>{{$t("collections.about")}}</p>
        <br>
        <p>{{$t("collections.dontNeed")}}
          <router-link to="/settings">{{$t("settingsText")}}</router-link>
        </p>
      </div>
    </section>
    <section v-if="docsLoaded" class="home__section">
      <h3>{{$t("homeContext.recentDocs")}}</h3>
      <div class="documents">
        <div @contextmenu.prevent="$refs.menu.close();  $refs.menu.open($event, doc)" v-for="doc in filteredDocs"
             class="doc__container">
          <router-link
              :to="openUrl(doc)"
              :key="doc.id"

              class="document"
          >
            <p class="title">{{ doc.title }}</p>
            <p class="description">
              {{ $t('opened') }}: {{ lastEdited(doc.opened) }}. {{ $t('owner') }}:
              {{ doc.owner }}
            </p>
          </router-link>
        </div>
        <vue-context ref="menu">
          <template slot-scope="child" v-if="child.data">
            <li>
              <router-link :to="openUrl(child.data)" target="_blank">{{$t("homeContext.OpenTab")}}</router-link>
            </li>
            <li v-if="collectionsEnabled && child.data.owner === 'You'">
              <a @click.prevent="openTagModal(child.data)">{{$t("homeContext.editTags")}}</a>
            </li>
            <li v-if="child.data.owner === 'You'"><a @click.prevent="deleteDoc(child.data)" class="btn--inline red">{{$t("delete")}}</a>
            </li>
          </template>
        </vue-context>
        <div v-if="docs.length <= 0 && docsLoaded" class="noDocs">
          <img src="../assets/undraw_files_6b3d.svg" alt="No Documents"/>
          <h3>{{ $t('noDocs') }}</h3>
          <p>{{ $t('noDocsDesc') }}</p>
        </div>
      </div>
    </section>

    <div v-if="featureModal" class="modal_container">
      <div class="modal--feature">
        <img src="../assets/undraw_around_the_world_v9nu.svg" alt=""/>
        <h3>{{ $t('feature.new') }}</h3>
        <p>{{ $t('feature.supports') }}</p>
        <p>{{ $t('feature.translate') }}</p>
        <p>
          {{ $t('feature.support') }}:
          <a href="mailto:support@graphitewriter.com"
          >support@graphitewriter.com</a
          >
        </p>
        <p>{{ $t('feature.useBox') }}</p>
        <Locale></Locale>
        <button @click="closeFeatureModal" class="btn">{{ $t('ok') }}</button>
      </div>
      <div class="modal_container" @click="closeFeatureModal"></div>
    </div>
    <div v-if="collectionsFeatureModal" class="modal_container">
      <div class="modal--feature">
        <img src="../assets/undraw_folder_39kl.svg" alt=""/>
        <h3>{{$t("collectionsOnboard.title")}}</h3>
        <p>{{$t("collectionsOnboard.subHead")}}</p>
        <p>{{$t("collectionsOnboard.thinkOf")}}</p>
        <p>{{$t("collectionsOnboard.allows")}}</p>
        <p>{{$t("collectionsOnboard.getStarted")}}</p>
        <p>{{ $t('feature.useBox') }}</p>
        <Locale></Locale>
        <button @click="collectionsFeatureModal = false" class="btn">{{ $t('ok') }}</button>
      </div>
      <div class="modal_container" @click="collectionsFeatureModal = false"></div>
    </div>
    <div v-if="tagModal" class="modal_container light">
      <div class="modal">
        <h3>{{$t("collections.tagsFor")}} "{{tagModalDoc.title}}"</h3>
        <p>{{$t("collections.used")}}</p>
        <vue-tags-input
            :validation="validation"
            v-model="tag"
            :tags="tags"
            :autocomplete-items="autoCompleteItems"
            @tags-changed="newTags => tags = newTags"
        />
        <p>{{$t("collections.onlyUse")}}</p>
        <button @click="closeTagModal" class="btn">{{ $t('done') }}</button>
      </div>
      <div class="modal_container light" @click="closeTagModal"></div>
    </div>
  </div>
</template>

<script>
  import Locale from '@/components/locale.vue'
  import VueContext from 'vue-context';
  import VueTagsInput from '@johmun/vue-tags-input';

  let timeout = null
  export default {
    name: 'Home',
    components: {Locale, VueContext, VueTagsInput},
    head: {
      title: {
        inner: "Graphite Writer",
        complement: 'Documents'
      },

    },
    data() {
      return {
        tagModalDoc: false,
        tags: [],
        tag: '',
        tagModal: false,
        validation: [{
          classes: 'no-braces',
          rule: ({text}) => {
            let regex = /[^A-Za-z0-9\s]+/
            // console.log(text,regex.test(text) )
            return regex.test(text)
          },
        }],
        collectionsEnabledOnServer: this.$config.getValue('collectionsEnabled').asBoolean() || window.location.hostname,
        featureModal: false,
        prominentLocale: this.$config.getValue('prominentLocalDisplay').asBoolean(),
        feedbackConfig: this.$config.getValue('feedback').asBoolean(),
        locale: 'en',
        search: '',
        loaded: false,
        accountInfo: false,
        version: require('../../package.json').version,
        trace: this.$perf.trace('loadDocuments'),
        feedback: false,
        shownCollections: false
      }
    },
    created() {
      this.trace.start()
    },
    computed: {
      autoCompleteItems() {
        let items = []
        Object.keys(this.collections).forEach(key => {
          items.push(this.collections[key].title)
        })
        return items
      },
      collectionsFeatureModal: {
        get() {
          console.log(localStorage.getItem("collectionsFeatureModal"), "collections settings")
          if (localStorage.getItem("collectionsFeatureModal") !== "true") {
            if (!this.shownCollections && !this.featureModal) {
              return true
            }
          }
          return false

        },
        set(val) {
          localStorage.setItem("collectionsFeatureModal", "true")
          this.shownCollections = true
        }
      },
      collectionsEnabled() {
        if (this.$store.getters.collectionsSetting === "true" || this.$store.getters.collectionsSetting === true) {
          console.log('true computed')
          if (this.collectionsEnabledOnServer) {
            if (this.$analytics) {
              this.$analytics.setUserProperties({"collectionsEnabled": true})
            }
            return true
          }

        }
        if (this.$analytics) {
          this.$analytics.setUserProperties({"collectionsEnabled": false})
        }
        return false


      },
      collections() {
        return this.$store.getters.collections ? this.$store.getters.collections : []
      },
      collectionsCount() {
        return Object.keys(this.collections).length
      },
      docsLoaded() {
        return this.$store.state.docsLoaded
      },
      docs() {
        if (this.$store.getters.userDocs.length > 0) {
          if (this.$analytics) {
            this.$analytics.setUserProperties({
              docCount: this.$store.getters.userDocs.length,
            })
          }
        }

        return this.$store.getters.userDocs
      },
      filteredDocs() {
        if (this.search.length <= 0) {
          return this.$store.state.docs
        } else {
          return this.$store.state.docs.filter((i) => {
            clearTimeout(timeout)
            timeout = setTimeout(this.logSearch, 1000)
            return i.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
        }
      },
      photoURL() {
        return `url(${this.$store.state.user.photoURL}) no-repeat center center`
      },
      user() {
        return this.$store.state.user
      },
    },
    methods: {
      openTagModal(doc) {
        this.tagModalDoc = doc
        // console.log(this.tagModalDoc)
        try {

          this.tags = doc.tags.map(i => {
            i.text = i.text.replace(/_/g, " ")
            return i
          })
        } catch {
          this.tags = []
        }

        this.tag = ''
        this.tagModal = true

      },
      closeTagModal() {

        this.tagModal = false
        let tags = this.tags
        if (!tags) {
          tags = []
        }
        tags = tags.filter(tag => {
          return tag.tiClasses.indexOf("ti-invalid") == -1
        })
        tags = tags.map(i => {
          i.text = i.text.replace(/ /g, "_")
          return i
        })
        // console.log(tags, "tags", this.tagModalDoc.id)
        this.$store.commit("setTags", {
          id: this.tagModalDoc.id,
          tags: tags
        })
        fetch(`${this.$store.getters.api}/api/v1/collections/${this.user.uid}/${this.tagModalDoc.id}`, {
          method: "post",
          headers: {
            "Authorization": this.$store.getters.fbToken,
            "content-type": "application/json"
          },
          body: JSON.stringify({tags: tags, time: this.$moment().unix()})

        }).then(res => res.json()).then(res => {
          if (res.success) {
            console.log('updated tags')
            this.$forceUpdate()
          }
        })

      },
      deleteDoc(doc) {
        this.$swal({
          title: "Are you sure?",
          text: `Once deleted, you will not be able to recover ${doc.title}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {

            fetch(`${this.$store.getters.api}/api/v1/documents/${this.user.uid}/${doc.id}`, {
              method: "delete",
              headers: {
                "Authorization": this.$store.getters.fbToken,
                "content-type": "application/json"
              },
              body: JSON.stringify({deleteDoc: true, time: this.$moment().unix()})

            }).then(res => res.json()).then(res => {
              if (res.success) {
                this.$store.dispatch('fetchDocs')

                if (this.$analytics) {
                  this.$analytics.logEvent("deletedDoc")
                }
              }
            })
          }
        });
      },
      feedBack() {
        window.localStorage.setItem("feedback", "true")
        this.$store.commit("feedback", false)
        if (this.$analytics) {
          this.$analytics.logEvent('openedFeedback')
        }
        var win = window.open("https://ronan092344.typeform.com/to/WkVNS1", '_blank');
        win.focus()
      },
      closeFeatureModal() {
        this.featureModal = false
        if (this.$analytics) {
          this.$analytics.logEvent('closedLanguageFeature')
        }
        localStorage.setItem('languageFeature', 'true')
      },
      openUrl(doc) {
        if (doc.sharedDoc) {
          return '/shared/' + this.user.uid + '/' + doc.id
        } else {
          return '/d/' + this.user.uid + '/' + doc.id
        }
      },
      logSearch() {
        console.log('Log search')
        timeout = null
        if (this.$analytics) {
          this.$analytics.logEvent('searching')
        }
      },
      logOut() {
        if (this.$analytics) {
          this.$analytics.logEvent('logout')
        }
        this.$firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = 'https://graphitewriter.com'
        })
      },
      lastEdited(time) {
        return this.$moment.unix(time).fromNow()
      },
      newDoc() {
        swal(this.$t('newDocName') + ':', {
          content: 'input',
          button: this.$t('ok'),
        }).then((value) => {
          if (value != null) {
            if (value.length <= 0) {
              value = 'Untitled'
            }

            fetch(`${this.$store.getters.api}/api/v1/documents/new`, {
              method: 'post',
              headers: {
                Authorization: this.$store.getters.fbToken,
                'content-type': 'application/json',
              },
              body: JSON.stringify({title: value, time: this.$moment().unix()}),
            })
            .then((res) => res.json())
            .then((res) => {
              if (res.success) {
                if (this.$analytics) {
                  this.$analytics.logEvent('newDoc')
                }
                this.$router.push(
                  `/d/${this.$store.getters.user.uid}/${res.id}`
                )
              }
            })
          }
        })
      },
    },

    mounted() {
      console.log(this.$store.getters.collectionsSetting, "collections")
      if (this.$analytics) {
        this.$analytics.logEvent('openedDocumentsPage')
      }
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            if (!localStorage.getItem('feedback') && this.feedbackConfig) {
              this.$store.commit("feedback", true)
            }
            // Send token to your backend via HTTPS
            this.$store.commit('setToken', idToken)
            this.$store.dispatch('fetchDocs')
            this.loaded = true
            this.trace.stop()
            if (
              !localStorage.getItem('languageFeature') &&
              this.prominentLocale
            ) {
              this.featureModal = true
              if (this.$analytics) {
                this.$analytics.logEvent('shownLanguageFeature')
              }
            }
            //console.log( this.$store.state.token)
          })
        } else {
        }
      })
    },
  }
</script>
