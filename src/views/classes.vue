<template>
  <main class="page classes">
    <h2 class="heading">Classes</h2>
    <div v-if="userData.classes" class="classes__classesContainer">
      <div @click="newClass" class="classesContainer__class new">
        <h1>New Class</h1>
      </div>
      <router-link :key="classOb.key" v-for="classOb in userData.classes" :to="'/class/' + uid + '/' + classOb.key"
                   class="classesContainer__class">
        <h1>{{classOb.data.name}}</h1>
      </router-link>

    </div>
    <h2 class="heading">Recent Notes</h2>
    <div class="classes__recentDocumentsContainer">
      <router-link :to="'/n/'+note.data.class+'/'+ note.key" :key="note.key" v-for="note in userData.notes" class="classes__recentDocument">
        <h1>{{note.data.name}} <span>{{dayCreated(note.data.timeCreated)}}</span></h1>
        <p>{{getClassName(note.data.class).data.name}} <span>Last Edited: {{lastEdited(note.data.lastEdited)}}</span>
        </p>
      </router-link>
    </div>

  </main>
</template>
<script>
  import '@/assets/css/classes.scss'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import swal from 'sweetalert'
  import moment from 'moment'

  export default {
    name: 'classes',
    data() {
      return {
        userData: {
          classes: [],
          notes: []
        },
        uid: false
      }
    },
    mounted() {
      this.$parent.loading = true
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let uid = user.uid;
          this.uid = user.uid;
          firebase.database().ref(`users/${uid}/`).on('value', snap => {
            let data = snap.val()
            if(!data) {
              this.$parent.loading = false;
            }
            //console.log(data)
            this.userData.classes = []
            for (let key in data.classes) {
              if (data.classes.hasOwnProperty(key)) {

                this.userData.classes.push({key: key, data: data.classes[key]})
              }
            }
            this.userData.notes = []
            for (let key in data.notes) {
              if (data.notes.hasOwnProperty(key)) {
              //  console.log(key + " -> " + data.notes[key]);
                // this.userData.classes.push({key: key, data: data.classes[key]})
                firebase.database().ref(`notesMeta/${key}`).on('value', note => {
                //  console.log(note.val())
                  this.userData.notes.push({key: key, data: note.val()})
                })
              }
            }

            this.$parent.loading = false
          })

        }
      })
    },
    methods: {
      getClassName(id) {
        return this.userData.classes.find(item => {
          return item.key == id;
        })
      },
      dayCreated(time) {
        return moment(time).format('dddd, MMMM Do')
      },
      lastEdited(time) {
        return moment(time).fromNow()
      },
      newClass() {
        swal("Name your class", {
          content: "input",
        })
        .then((value) => {
          if (value && value != '' && value != ' ') {
            firebase.database().ref(`users/${this.uid}/classes`).push().set({
              name: value,
              notes: {}
            })
          }

        });
      }
    }
  }
</script>