$(document).ready(function ($) {
  var str = 'a modern text editor.t',
    i = 0,
    isTag,
    text;

  (function type () {
    text = str.slice(0, ++i)
    if (text === str) return

    document.getElementById('typewriter').innerHTML = text

    var char = text.slice(-1)
    if (char === '<') isTag = true
    if (char === '>') isTag = false

    if (isTag) return type()
    setTimeout(type, 80)
  }())
  setTimeout(function () {
    var str = 'a faster text editor.t',
      i = 0,
      isTag,
      text;

    (function type () {
      text = str.slice(0, ++i)
      if (text === str) return

      document.getElementById('typewriter').innerHTML = text

      var char = text.slice(-1)
      if (char === '<') isTag = true
      if (char === '>') isTag = false

      if (isTag) return type()
      setTimeout(type, 80)
    }())
    setTimeout(function () {
      var str = 'an easier text editor.t',
        i = 0,
        isTag,
        text;

      (function type () {
        text = str.slice(0, ++i)
        if (text === str) return

        document.getElementById('typewriter').innerHTML = text

        var char = text.slice(-1)
        if (char === '<') isTag = true
        if (char === '>') isTag = false

        if (isTag) return type()
        setTimeout(type, 80)
      }())
    }, 5000)
  }, 5000)
  $('#learnMore').on('click', () => {
    $('html,body').animate({
      scrollTop: $('#sectiontwo ').offset().top
    },
      'slow')
  })
})
