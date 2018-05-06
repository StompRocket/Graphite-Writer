<template>
  <div id="fourOhFour" class="page">
      <h1 class="big">404</h1>
      <h2>This page could not be found</h2>
      <br>
      <router-link to="/" class="button warning">Return Home</router-link>
  </div>
</template>
<script>
import "@/assets/fourOhFour.scss";
export default {
  name: "fourOhFour",
  created() {
    document.title = `Graphite Writer BETA v${this.$parent.version}  | 404`
  }
};
</script>

