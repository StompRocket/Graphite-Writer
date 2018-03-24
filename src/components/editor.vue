<template>
<div class="page editor">
  <br />
  <div class="container">
    <div class="box container">
      <h1>
       <span contenteditable="true" id="docTitle">Document Name</span>
      </h1>
       <small>Document ID {{ $route.params.document }}</small>
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
