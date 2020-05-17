import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: false,
    token: false,
    docs: [],
    docsLoaded:false,
  // api: "http://localhost:3008"
    api: "https://api.graphitewriter.com"
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setDocs(state, docs) {
      state.docsLoaded = true
      state.docs = docs
    },
    setToken (state, token) {
      state.token = token
    },
    setTags(state, data) {
      //console.log('setting tags')
      let id = data.id
      let tags = data.tags
      let i = 0
      let index = 0
      for (i in state.docs) {
        if (state.docs[i]["id"] === id) {
          index = i
        }
        i++
      }
     // console.log("for", state.docs[index].title)
      state.docs[index].tags = tags
    }
  },
  getters: {
    api(state) {
      if (window.location.hostname == "localhost") {
        return "http://localhost:3008"
      }
      return state.api
    },
    fbToken(state, getters) {
      if (state.token) {
        return state.token
      } else {

        return false
        }
    },
    user(state) {
      return state.user
    },
    userDocs(state, getters) {

        return state.docs.sort((a,b) => {
          //console.log(moment.unix(a.opened), moment.unix(b.opened))
          return b.index - a.index

        })

    },
    collections(state) {
      let result = {}
      state.docs.forEach(doc => {
        doc.tags.forEach(tag => {
          if (result[tag.text]) {
            result[tag.text].docs.push(doc.id)
          } else {
            result[tag.text] = {
              id: tag.text,
              title: tag.text.replace(/_/g, " "),
              docs: [doc.id]
            }
          }

          console.log(tag.text)
        })
      })
      return result
    }
  },
  actions: {
    fetchDocs(context) {
      console.log("fetch docs")
      if ( context.getters.fbToken) {

        fetch(`${context.getters.api}/api/v1/documents`, {
          method: "get",
          headers: {
            "Authorization": context.getters.fbToken
          }

        }).then(res => res.json()).then(res => {
          context.commit("setDocs", res)
          console.log(res)
          return res
        })


      }
    }
  },
  modules: {
  }
})
