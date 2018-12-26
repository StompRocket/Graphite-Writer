<template>
  <main class="page class">
    <h1 class="class__name">{{classOb.name}}</h1>
    <button @click="newNote" class="class__newNote">New Note</button>
    <div class="class__documentContainer">
      <router-link :key="note.key" v-for="note in notes" :to="'/n/'+$route.params.id+'/'+ note.key"
                   class="class__document">
        <h1>{{note.data.name}} <span>{{dayCreated(note.data.dayCreated)}}</span></h1>
        <p>Edited: {{lastEdited(note.data.lastEdited)}}</p>
      </router-link>

    </div>
  </main>
</template>
<script>
  import '@/assets/css/class.scss'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import swal from 'sweetalert'
  import moment from 'moment'

  export default {
    name: 'class',
    data() {
      return {
        uid: false,
        classOb: {},
        notes: []
      }
    },
    mounted() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.uid = user.uid
          let uid = user.uid
          firebase.database().ref(`users/${uid}/classes/${this.$route.params.id}`).on('value', snap => {
            //console.log(snap.val())
            if (!snap.val()) {
              this.$router.push('/')
            }
            this.$parent.loading = false;
            this.classOb = snap.val()
            this.notes = []
            for (let key in this.classOb.notes) {
              if (this.classOb.notes.hasOwnProperty(key)) {
                //console.log(key + " -> " + this.classOb.notes[key]);
                firebase.database().ref(`notesMeta/${key}`).on('value', note => {
                  // console.log(note.val())
                  this.notes.push({key: key, data: note.val()})
                })
              }
            }
          })
        }
      })

    },
    methods: {
      newNote() {
        swal("New Note Name:", {
          content: "input",
        })
        .then((value) => {
          let newDocTemplate;
          if (value && value != '' && value != ' ') {
            console.log(value + 'value')
            firebase.database().ref('newDocTemplate/').once('value').then(template => {
              newDocTemplate = template.val()
              // console.log(newDocTemplate)
              let timeStamp = moment().toJSON();
              let newRef = firebase.database().ref(`notesMeta/`).push()
              newRef.set({
                class: this.$route.params.id,
                dayCreated: timeStamp,
                keywords: [value],
                lastEdited: timeStamp,
                name: value,
                owner: this.uid
              })
              //console.log(newRef.key)
              firebase.database().ref(`users/${this.uid}/classes/${this.$route.params.id}/notes/${newRef.key}`).set(newRef.key)
              firebase.database().ref(`users/${this.uid}/notes/${newRef.key}`).set(newRef.key)
              firebase.database().ref(`noteData/${newRef.key}`).set({data: newDocTemplate})
            })
          }


        });
      },
      dayCreated(time) {
        return moment(time).format('MMM, Do')
      },
      lastEdited(time) {
        return moment(time).fromNow()
      }

    }
  }
</script>