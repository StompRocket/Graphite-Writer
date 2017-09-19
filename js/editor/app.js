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
  [{
    'font': []
  }],
  [{
    'size': []
  }],
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'link', 'code-block', 'image'],
  [{
    'color': []
  }, {
    'background': []
  }], // dropdown with defaults from theme
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
    'align': []
  }],

  ['clean'] // remove formatting button
]
$(document).ready(function ($) {
  document.addEventListener('scroll', function (event) {
    var element_position = $('#deleteDoc').offset().top
    if (element_position < 1) {
      console.log('triggerd')
      $('.ql-toolbar').css('width', '100%')
      $('.ql-toolbar').css('z-index', '999')
      $('.ql-toolbar').css('top', '0')
      $('.ql-toolbar').css('position', 'fixed')
      $('.ql-toolbar').css('margin-left', '-5%')
    } else {
      $('.ql-toolbar').css('margin', '0px')
      $('.ql-toolbar').css('top', 'initial')
      $('.ql-toolbar').css('position', 'static')
    }
  }, true /* Capture event */)
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
      const docVersion = GetURLParameter('v')
      var prevent = 1

      function encrypt (o) {
        var data = quill.getContents()
        o = JSON.stringify(data)
        o = sjcl.encrypt(uid, o)

        return o
      }

      function decrypt (o) {
        o = sjcl.decrypt(uid, o)
        return JSON.parse(o)
      }

      function saveDocument (data) {
        $('#saving').text('Saving...')
        var date = new Date()
        date = date.toString()
        date = date.split(' ').slice(0, 5).join(' ')

        firebase.database().ref('users/' + uid + '/docsStorage/' + documentname + '/').set({
          data: encrypt(data),
          title: $('#doctitle').text(),
          date: date,
          utcdate: new Date().getTime(),
          enc: true,
          version: 2
        }).then(() => {
          $('#saving').text('Saved')
          $('#lastedited').text(date)
        })
        firebase.database().ref('users/' + uid + '/docs/' + documentname + '/').set({
          data: '',
          title: $('#doctitle').text(),
          date: date,
          utcdate: new Date().getTime(),
          enc: true,
          version: 2
        })
        var url = window.location.href
        var lastPart = url.substr(url.lastIndexOf('=') + 1)
        if (!lastPart == 2) {
          var stateObj = {
            foo: 'bar'
          }

          url = (url.slice(0, -1) + '2')
          history.pushState(stateObj, 'page 2', url)
        }
      }
      $('#share').on('click', () => {
        var sharedDocRef = firebase.database().ref('shared/' + uid + '/docs/' + documentname)
        var date = new Date()
        date = date.toString()
        date = date.split(' ').slice(0, 5).join(' ')
        sharedDocRef.set({
          'data': quill.getContents(),
          'title': $('#doctitle').text(),
          'date': date
        })
        $('#shareLink').text('graphitewriter.com/shared?u=' + uid + '&d=' + documentname)
        $('#shareLink').attr('href', 'https://graphitewriter.com/shared?u=' + uid + '&d=' + documentname)
        $('#shareModal').addClass('is-active')
        $('.close-share').on('click', () => {
          $('#shareModal').removeClass('is-active')
        })
      })

      function updateContents () {
        if (docVersion == 2) {
          var docRef = firebase.database().ref('users/' + uid + '/docsStorage/' + documentname + '/')
        } else {
          docRef = firebase.database().ref('users/' + uid + '/docs/' + documentname + '/')
        }
        console.log(docRef)
        docRef.once('value').then(function (snapshot) {
          var fbdata = snapshot.val().data
          var fbtitle = snapshot.val().title
          var fbdate = snapshot.val().date
          var enc = snapshot.val().enc
          console.log(fbdate + 'date')
          if (fbdate == null || fbdate == 'undefined') {
            window.location.href = '/app'
          }
          fbdate = fbdate.split(' ').slice(0, 5).join(' ')
          $('#lastedited').text(fbdate)
          $('#doctitle').text(fbtitle)
          document.title = fbtitle

          if (enc) {
            quill.setContents(decrypt(fbdata))
          } else {
            quill.setContents(fbdata)
          }

          $('#loader').hide()
          $('#doccontainer').fadeIn()
        })
      }
      updateContents()
      window.onbeforeunload = function () {
        if ($('#saving').text() !== 'Saved') {
          saveDocument(quill.getContents())
          return 'Your document has not been saved please wait untill it has finished'
        }
      }
      // setup before functions
      var typingTimer // timer identifier
      var doneTypingInterval = 2000 // time in ms

      // user is "finished typing," do something
      function doneTyping () {
        var currentdocument = quill.getContents()
        saveDocument(currentdocument)
      }
      $('#doctitle').on('keyup', function () {
        $('#saving').text('Waiting...')
        clearTimeout(typingTimer)
        typingTimer = setTimeout(doneTyping, doneTypingInterval)
      })
      var prevention = 1
      quill.update()
      quill.on('text-change', function (delta, oldDelta, source) {
        if (prevention === 1) {
          prevention++
        } else {
          $('#saving').text('Waiting...')
          clearTimeout(typingTimer)
          typingTimer = setTimeout(doneTyping, doneTypingInterval)
        }
      })

      $('#deleteDoc').on('click', () => {
        var deletedoc = confirm('Are you sure you want to delete this document?')
        if (deletedoc == true) {
          var updates = {}
          updates['users/' + uid + '/docs/' + documentname] = null
          updates['users/' + uid + '/docsStorage/' + documentname] = null
          firebase.database().ref().update(updates)

          window.location.href = '/app'
        }
      })
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
