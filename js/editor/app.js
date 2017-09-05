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

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'link', 'code-block'],
  [{
    'header': 1
  }, {
    'header': 2
  }], // custom button values
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'script': 'sub'
  }, {
    'script': 'super'
  }], // superscript/subscript
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }], // outdent/indent
  [{
    'direction': 'rtl'
  }], // text direction

  [{
    'size': []
  }],

  [{
    'color': []
  }, {
    'background': []
  }], // dropdown with defaults from theme
  [{
    'font': []
  }],
  [{
    'align': []
  }],

  ['clean'] // remove formatting button
]
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
      const documentname = GetURLParameter('d')
      var prevent = 1

      function saveDocument (data) {
        if (prevent === 1) {
          prevent = 2
        } else {
          var date = new Date()
          date = date.toString()
          date = date.split(' ').slice(0, 5).join(' ')
          $('#lastedited').text(date)
          firebase.database().ref('users/' + uid + '/docs/' + documentname + '/').set({
            data: data,
            title: $('#doctitle').text(),
            date: date
          })
        }
      }

      function updateContents () {
        firebase.database().ref('users/' + uid + '/docs/' + documentname + '/').once('value').then(function (snapshot) {
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
      quill.update()
      quill.on('text-change', function (delta, oldDelta, source) {
        // console.log('change')
        var currentdocument = quill.getContents()
        saveDocument(currentdocument)
      })
      $('#doctitle').on('keyup', (e) => {
        var currentdocument = quill.getContents()
        console.log(currentdocument)
        saveDocument(currentdocument)
      })

      // create canvas object

      $(document).keydown(function (event) {
        // If Control or Command key is pressed and the S key is pressed
        // run save function. 83 is the key code for S.
        if ((event.ctrlKey || event.metaKey) && event.which == 83) {
          // Save Function
          event.preventDefault()
          var currentdocument = quill.getContents()
          var Currenttitle = $('#title').text()
          saveDocument(currentdocument)
          return false
        }
      })
    }
  })

  var quill = new Quill('#editor', {
    modules: {
      'toolbar': toolbarOptions
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  })
  var tooltip = quill.theme.tooltip
  var input = tooltip.root.querySelector('input[data-link]')
  input.dataset.link = 'https://www.google.com'
})
