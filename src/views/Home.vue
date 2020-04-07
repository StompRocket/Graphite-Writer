<template>
  <div class="home page">
    <nav class="nav">
      <img class="brand--wordmark" src="@/assets/wordmark.svg">
      <form @submit.prevent class="search__form">
        <input type="text" class="input search" placeholder="Search">
      </form>
      <button class="btn new">NEW</button>
      <button class="user"></button>
    </nav>
    <div class="documents">
      <div v-for="i in 10" class="document">
        <p class="title">The Great Artists of Carrot Nation {{i}}</p>
        <p class="description">Opened: 5 min ago. Owner: You</p>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    components: {}
  }
</script>
