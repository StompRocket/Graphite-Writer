<template>
<div class="page documents">
  <div class="container">
    <br />
    <h1>Documents</h1>
    <span class="multi-input fullwidth">
      <input class="input" type="text" width="100%" placeholder="Search"/>
      <a class="button input warning" width="100%" href="#newDocumentModal">Search</a>
    </span>
    <br />
    <br />
    <a class="button warning" width="100%" href="#newDocumentModal">New Document</a>

    <br /> <br />

    <router-link :to="{ name: 'editor', params: {document: '234fsdf'} }" class="document-preview">
      <div class="box material container">
        <h3>Document Name</h3>
        <small>
         <i>Last Edited: datetime</i>
        </small>
      </div>

    </router-link>
  </div>
  <div class="modal" id="newDocumentModal">
    <div class="modal-body box material deep">
      <div class="container">
        <i class="modal-close fas fa-times" /> <br />
        <h3>Create Document </h3>
        <span class="multi-input">
          <input type="text" class="input" v-model="newDocName" placeholder="Name Your Document" @keyup.enter="newDoc"/>
          <router-link class="button primary input" :to="{name: 'editor', params: {document: 'new', name: newDocName}}">Create</router-link>
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
    newDocName: ''
  }),
  methods: {

    newDoc() {
      this.$router.push({
        name: 'editor',
        params: {
          document: 'new',
          name: this.newDocName
        }
      })
    }

  }
}
</script>
