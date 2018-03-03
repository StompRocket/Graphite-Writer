<template>
<div class="page editor">
  <h1>editor</h1>
  <p>Document: {{ $route.params.document }}</p>
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
