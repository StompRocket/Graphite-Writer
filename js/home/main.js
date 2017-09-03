$(document).ready(function ($) {
  var str = 'This is a test',
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
})
