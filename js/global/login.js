$(document).ready(function ($) {
  $('#loginContainer').on('click', (e) => {
    var user = firebase.auth().currentUser

    if (user) {
      // User is signed in.
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
      }).catch(function (error) {
        window.alert(error)
      })
    } else {
      // No user is signed in.
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        window.alert(errorCode, errorMessage)
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
    }
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
      firebase.database().ref('/users/' + uid + '/userinfo/username').once('value').then(function (snapshot) {
        if (!snapshot.val()) {
          console.log('no snapshot')
          var welcomedoc = firebase.database().ref('users/' + uid + '/docs/').push()
          welcomedoc.set({
            'data': '{"ops":[{"attributes":{"color":"#363636","bold":true},"insert":"Welcome To Graphite"},{"attributes":{"header":1},"insert":"\\n"},{"insert":"A modern text editor"},{"attributes":{"header":2},"insert":"\\n"},{"insert":"\\nIf you have any questions or concerns please contact us at "},{"attributes":{"link":"mailto:support@graphitewriter.com"},"insert":"support@graphitewriter.com"},{"insert":"\\n"},{"attributes":{"header":1},"insert":"\\n"}]}',
            'title': 'Welcome To Graphite'
          })
        }
        firebase.database().ref('users/' + uid + '/userinfo/').set({
          username: name,
          email: email,
          profile_picture: photoUrl
        })
      })
      $('#loginBtn').text('Logout')
    } else {
      $('#loginBtn').text('Login')
      if (window.location.href.indexOf('app') >= 0 || window.location.href.indexOf('edit') >= 0) {
        firebase.auth().signInWithRedirect(provider)
      }
    }
  })
})
