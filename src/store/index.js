import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: false,
    token: false,
    docs: [],
    api: "http://localhost:3008"
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setDocs(state, docs) {
      state.docs = docs
    },
    setToken (state, token) {
      state.token = token
    }
  },
  getters: {
    api(state) {
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
          return b.index - a.index
        })

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
          return res
        })


      }
    }
  },
  modules: {
  }
})
