<template>
  <main class="page newNote">
    <select id="newNoteClass">
      <option :selected="selected(i.key)" :key="i.key" v-for="i in classes" :value="i.key">{{i.data.name}}</option>
      <option value="none">none</option>
    </select>
    <label for="newNoteClass">Class</label>
  </main>
</template>

<script>
  import '@/assets/css/newNote.scss'
  import firebase from 'firebase/app'
  import 'firebase/database'

  export default {
    name: "newNote",
    data() {
      return {
        classes: []
      }
    },
    mounted() {
      this.$parent.loading = true
      firebase.database().ref(`/users/${this.$parent.user.uid}/classes`).on('value', classes => {
        this.classes = []
        console.log(classes.val())
        let data = classes.val()
        for (let key in data) {
          if (data.hasOwnProperty(key)) {

            this.classes.push({key: key, data: data[key]})
            //console.log(data.classes[key].notes)

          }
        }
        this.$parent.loading = false
      })
    },
    methods: {
      selected(id) {
        if (this.$route.params.class) {
          if (id == this.$route.params.class) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }

    }
  }
</script>
