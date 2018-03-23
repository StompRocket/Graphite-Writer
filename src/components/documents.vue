<template>
<div class="page documents">
  <div class="container">
    <h2>Documents</h2>
    <br />
    <span class="multi-input">
      <input class="input" type="text" width="100%" placeholder="Search"/>
      <a class="button primary input" width="100%" href="#newDocumentModal">Search</a>
    </span>
    <br />
    <br />
    <a class="button dark" width="100%" href="#newDocumentModal">New Document</a>
  </div>

  <div class="modal" id="newDocumentModal">
    <div class="modal-body box material deep">
      <div class="container">
        <i class="modal-close fas fa-times" /> <br />
        <h3>Create Document </h3>
        <span class="multi-input">
          <input type="text" class="input" placeholder="Name Your Document" />
          <a class="button primary input" href="#/d/">Create</a>
        </span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import '../assets/documents.scss'
export default {
  name: "documents",
  data: () => ({

  })
}
</script>
