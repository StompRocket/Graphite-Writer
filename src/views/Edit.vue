<template>
  <div class="page">
    <nav class="nav editor">
      <img class="brand--icon" src="@/assets/icon.svg">
      <form @submit.prevent class="docTitle">
        <input type="text" class="input title" placeholder="Document Name">
      </form>
      <button class="nav-item">Print</button>
      <button class="nav-item">Delete</button>
      <button class="btn share">SHARE</button>

    </nav>


    <div id="toolbar">
      <!-- Add font size dropdown -->
      <select class="ql-size">
        <option value="small"></option>
        <!-- Note a missing, thus falsy value, is used to reset to default -->
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <!-- Add a bold button -->
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <span class="ql-formats">
         <button type="button" class="ql-indent" value="-1"></button>
         <button type="button" class="ql-indent" value="+1"></button>
         <select class="ql-align">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
         </select>
         <button type="button" class="ql-direction" value="rtl"></button>
         <button type="button" class="ql-list" value="ordered"></button>
         <button type="button" class="ql-list" value="bullet"></button>
      </span>
      <span class="ql-formats">
         <button type="button" class="ql-image"></button>
         <button type="button" class="ql-code-block"></button>
         <button type="button" class="ql-script" value="sub"></button>
         <button type="button" class="ql-script" value="super"></button>
         <button type="button" class="ql-clean"></button>
      </span>
      <!-- Add subscript and superscript buttons -->

    </div>
      <div class="editor__app">
        <div class="editor__document" id="doc">

        </div>
      </div>

  </div>
</template>

<script>
  import Quill from "quill/dist/quill.min.js"
  import "quill/dist/quill.core.js"
  import "quill/dist/quill.core.css"
  import "quill/dist/quill.snow.css"
  const toolbarOptions = [
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
  export default {
    name: 'Editor',
    components: {},
    mounted() {
      var options = {
        debug: 'info',
        modules: {
          toolbar: "#toolbar"
        },
      theme: "snow",
        placeholder: 'Compose an epic...',
      };
      console.log("created", document.getElementById("doc"))
      let editor = new Quill("#doc",options)
    }
  }
</script>
