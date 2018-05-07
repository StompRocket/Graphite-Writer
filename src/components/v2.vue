<template>
<div class="page v2">
	<div style="padding:42.5% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/262302933" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
	

</div>
</template>
<script src="https://player.vimeo.com/api/player.js"></script>
<script>
import "../assets/v2.scss";
export default {
  name: "v2",
  data: () => ({}),
  created() {
    document.title = `Graphite Writer BETA v${this.$parent.version}  | Whats New`
  }
};
</script>

