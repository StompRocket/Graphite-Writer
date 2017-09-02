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
        if (errorCode) {
          window.alert(errorCode, errorMessage)
        }
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
      $('#loginBtn').text('Logout')
    } else {
      $('#loginBtn').text('Login')
      if (window.location.href.endsWith('/app') || window.location.href.endsWith('/editor')) {
        window.location.href = '/index'
      }
    }
  })
})
