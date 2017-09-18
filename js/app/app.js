NProgress.configure({
  showSpinner: false
})
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser
    var name, email, photoUrl, uid, emailVerified

    if (user != null) {
      name = user.displayName
      email = user.email
      photoUrl = user.photoURL
      emailVerified = user.emailVerified
      uid = user.uid // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    var vm = new Vue({
      el: '#app',

      firebase: {
        // can bind to either a direct Firebase reference or a query
        fbdocs: {
          source: db.ref('/users/' + uid + '/docs/').orderByChild('utcdate'),
          readyCallback: function () {
            this.fbdocs = this.fbdocs.slice().reverse()
            this.docs = this.fbdocs

            //  console.log('ready', 'data')
            //  this.docs = this.docs.slice().reverse()
            //  console.log(this.docs)
          }
        }
      },
      data: {
        loaded: true,
        newDocName: '',
        docs: [],
        modalDisplay: false,
        docSearch: '',
        cache: []
      },

      mounted: function () {
        //  console.log('ready')
      },

      methods: {

        getUrl: function (key) {
          this.loaded = false
          var docKey = Object.values(key).slice(-1)[0]
          return '/edit?d=' + docKey
        },
        getAlt: function (title) {
          if (title) {
            title = JSON.stringify(title)
            title = title.toLowerCase()
            return title
          } else {
            return 'ERROR'
          }
        },
        show: function (title) {
          if (title) {
            return true
          } else {
            return false
          }
        },
        openNewDoc: function () {
          this.modalDisplay = true
        },
        closeNewDoc: function () {
          this.modalDisplay = false
        },
        createNewDoc: function () {
          var newDocName = this.newDocName
          if (newDocName) {
            console.log(newDocName)
            var newDocRef = firebase.database().ref('users/' + uid + '/docs/').push()
            var date = new Date()
            date = date.toString()
            newDocRef.set({
              'data': '',
              'title': newDocName,
              'date': date,
              'utcdate': new Date().getTime()
            })
            this.newDocName = ''
            this.modalDisplay = false
          } else {
            window.alert('Document Names Must Be More than 1 Character')
          }
        },
        search: function () {
          var query = this.docSearch.toLowerCase()
          let result = this.fbdocs
          if (!query) {
            // console.log(this.fbdocs)
            this.docs = this.fbdocs
            return this.fbdocs
          }

          const filterValue = query

          const filter = (docs) => {
            if (JSON.stringify(docs.title)) {
              return JSON.stringify(docs.title).toLowerCase().includes(filterValue)
            }
          }

          this.docs = result.filter(filter)
          //  console.log(this.docs)
        }

      },
      filters: {
        reverse: function (array) {
          return array.slice().reverse()
        }
      }
    })
  }
})
