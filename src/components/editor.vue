<template>
<div class="page editor">
  <br />
  <div class="container">
    <div class="box container material">
      <h2>
       <span contenteditable="true" id="docTitle">Document Name</span>
      </h2>
       <p>Document ID {{ $route.params.document }}</p>
    </div>

    <div id="editor box container">
      <i>Compose an epic...</i>
    </div>
  </div>
</div>
</template>
<script>
import '../assets/editor.scss'
export default {
  name: "editor",
  data: () => ({

  })
}

</script>
