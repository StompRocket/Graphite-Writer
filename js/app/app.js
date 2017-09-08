$(document).ready(function ($) {
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
        $('#newDocModal').addClass('is-active')
      })
      $('.modal-background').on('click', function () {
        $('#newDocModal').removeClass('is-active')
      })
      $('#newDocBtn').on('click', () => {
        var newDocName = $('#newDocName').val()
        if (newDocName) {
          console.log(newDocName)
          var newDocRef = firebase.database().ref('users/' + uid + '/docs/').push()
          var date = new Date()
          date = date.toString()
          newDocRef.set({
            'data': '',
            'title': newDocName,
            'date': date
          })
          $('#newDocName').val('')
          $('#newDocModal').removeClass('is-active')
        } else {
          window.alert('Document Names Must Be More than 1 Character')
        }
      })
      var docsRef = firebase.database().ref('users/' + uid + '/docs/').orderByChild('date')
      docsRef.on('child_added', function (data) {
        var docKey = data.key
        var docTitle = data.val().title
        var docDate = data.val().date
        docDate = docDate.split(' ').slice(0, 4).join(' ')

        var docLink = '/edit?d=' + docKey
        $('#docContainer').append('<a alt="' + docTitle.toLowerCase() + '" href="' + docLink + '" class="box full-white noLine"><h1 class="title is-4">' + docTitle + '</h1><p class="date">Last Edited: ' + docDate + '</p></a>')
        $('#loader').hide()
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
