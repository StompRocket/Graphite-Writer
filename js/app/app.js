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
      var docsRef = firebase.database().ref('users/' + uid + '/docs/')
      docsRef.on('child_added', function (data) {
        var docKey = data.key
        var docTitle = data.val().title
        var docDate = data.val().date
        docDate = docDate.split(' ').slice(0, 4).join(' ')
        console.log(data.val())
        var docLink = '/edit?d=' + docKey
        $('#docContainer').append('<a href="' + docLink + '" class="box full-white noLine"><h1 class="title is-4">' + docTitle + '</h1><p class="date">Last Edited: ' + docDate + '</p></a>')
      })
    }
  })
})
