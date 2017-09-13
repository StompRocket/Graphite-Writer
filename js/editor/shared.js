function GetURLParameter (sParam) {
  var sPageURL = window.location.search.substring(1)
  var sURLVariables = sPageURL.split('&')
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] == sParam) {
      return sParameterName[1]
    }
  }
}

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
      const documentname = GetURLParameter('d')
      const docuid = GetURLParameter('u')
      if (docuid == uid) {
        if (window.confirm('You are viewing a view only version of your own document. Click ok to redirect to an editable version of this document, or click cancel to continue viewing this version.') == true) {
          window.location.href = '/edit?d=' + documentname
        }
      }
      var prevent = 1

      function updateContents () {
        firebase.database().ref('shared/' + docuid + '/docs/' + documentname + '/').once('value').then(function (snapshot) {
          var fbdata = snapshot.val().data
          var fbtitle = snapshot.val().title
          var fbdate = snapshot.val().date
          fbdate = fbdate.split(' ').slice(0, 5).join(' ')
          $('#lastedited').text(fbdate)
          $('#doctitle').text(fbtitle)
          document.title = fbtitle
          quill.setContents(fbdata)
        })
      }
      updateContents()
    }
  })

  var quill = new Quill('#editor', {
    modules: {
      'toolbar': false
    },
    placeholder: 'Compose an epic...',
    readOnly: true,
    theme: 'snow'
  })
})
