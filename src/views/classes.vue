<template>
  <main class="page classes">
    <h2 class="heading">Classes</h2>
    <div class="classes__classesContainer">
      <div class="classesContainer__class new">
        <h1>New Class</h1>
      </div>
      <router-link to="/class/test" class="classesContainer__class">
        <h1>English 1E</h1>
      </router-link>
      <router-link to="/class/test" class="classesContainer__class">
        <h1>Spanish 1A</h1>
      </router-link>
      <router-link to="/class/test" class="classesContainer__class">
        <h1>Design And Technology</h1>
      </router-link>
      <router-link to="/class/test" class="classesContainer__class">
        <h1>CMA</h1>
      </router-link>
      <router-link to="/class/test" class="classesContainer__class">
        <h1>Deductive Geometry</h1>
      </router-link>
    </div>
    <h2 class="heading">Recent Documents</h2>
    <div class="classes__recentDocumentsContainer">
      <div class="classes__recentDocument">
        <h1>Left Triangles <span>Monday February 30th</span></h1>
        <p>Spanish 1A <span>Last Edited: 2 days ago</span></p>
      </div>
    </div>
    <div class="classes__recentDocumentsContainer">
      <div class="classes__recentDocument">
        <h1>Wrong Triangles <span>Friday February 31st</span></h1>
        <p>Fabrics <span>Last Edited: 3 days ago</span></p>
      </div>
    </div>
  </main>
</template>
<script>
  import '@/assets/css/classes.scss'

  export default {
    name: 'classes'
  }
</script>