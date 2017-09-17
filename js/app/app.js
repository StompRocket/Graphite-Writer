$(document).ready(function ($) {
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

      $('#newDocFab').on('click', function () {
        console.log('newdoc')
        $('#newDocModal').addClass('is-active')
      })
      $('.modal-background').on('click', function () {
        $('#newDocModal').removeClass('is-active')
      })

      var vm = new Vue({
        el: '#app',
        data: {
          loaded: true
        },
        firebase: {
          // can bind to either a direct Firebase reference or a query
          docs: db.ref('/users/' + uid + '/docs/')
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
            $('#newDocModal').addClass('is-active')
          },
          closeNewDoc: function () {
            $('#newDocModal').removeClass('is-active')
          },
          createNewDoc: function () {
            var newDocName = $('#newDocName').val()
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
              $('#newDocName').val('')
              $('#newDocModal').removeClass('is-active')
            } else {
              window.alert('Document Names Must Be More than 1 Character')
            }
          }
        }
      })

      function test () {
        $('#search').on('keyup', function (acache) {
          var query = $('#search').val().toLowerCase()

          //  console.log(myImage)
          var $pictureList = $('#docContainer a')
          if (query) {
            $pictureList.hide()

            $pictureList.each(function () {
              if ($(this).attr('alt').indexOf(query) >= 0) {
                $(this).fadeIn(400, function () {
                  // Stuff to do *after* the animation takes place
                })
              }
            })
          } else {
            $pictureList.fadeIn(400, function () {
              // Stuff to do *after* the animation takes place
            })
          }
        })
      }
      test()
    }
  })
})
