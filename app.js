var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

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
    'header': [1, 2, 3, 4, 5, 6, false]
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
  var quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  })
})
