<template>
  <div id="fourOhFour" class="page">
      <h1>404</h1>
      <h1>Uh Oh...</h1>
      <h3>It looks like we've lost this page :(</h3>
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

