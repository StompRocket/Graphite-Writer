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
  </div>
</template>

<script>

  export default {
    name: 'Home',
    components: {}
  }
</script>
