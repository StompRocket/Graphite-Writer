<template>
<div class="page home">
  <div class="banner-image">
  	<div class="container">
  		<div class="center-box">
	  		<h1 class="big" style="margin-bottom: 0; padding-bottom: 0;"><b>Graphite Writer</b> v2</h1>
	  		<h2 style="margin-bottom: 1em; font-weight: 500;">A Modern Text Editor</h2>
	  		<router-link class="button dark" to="/login">Start Now</router-link>
        <router-link class="button dark" to="/v2">What's New</router-link>
	  	</div>
  	</div>
  </div>

  <div class="container white">
    <br />
    <br />
    <h3>From the begenning we noticed a problem, text editors were either fast or cloud based, not both. We built Graphite Writer to solve tihs problem. Graphite Writer was designed from the ground up as a fast, easy to use, and secure text editor. All your documents are saved in the cloud, and can be accessed from anywhere. </h3>
    <h3> At Graphite Writer we respect your privacy. That's why all your documents are encrypted with military grade security. Unlike <a href="https://www.theguardian.com/commentisfree/2014/apr/18/corporations-google-should-not-sell-customer-data" class="dark" target="_blank">some companies</a>, we believe your information is <i>yours</i>, which is why we don't sell it, or give it away without your permission.</h3>
    <br>
    <br>

    <div class="row">
      <div class="column center">
        <span class="underline-warning">
          <h1>Speed</h1>
        </span>
      </div>
      <div class="column center">
        <span class="underline-warning">
          <h1>Usability</h1>
        </span>
      </div>
      <div class="column center">
        <span class="underline-warning">
          <h1>Security</h1>
        </span>
      </div>
    </div>
    <h1>Over 150 satisfied users</h1>

    <div class="box material container">
      <h2><i class="fas fa-quote-left quote-testimonial"></i>Loads like a million times faster<i class="fas fa-quote-right quote-testimonial-end"></i></h2>
      <i> - Max, satisfied Graphite Writer user</i>
    </div>

    <br>
    <h1>What's New in v2?</h1>

  </div>

  <div class="row">
    <div class="column container">
     <h2>Introducing</h2>
     <h1>Real-Time Sharing</h1>
   </div>
   <div class="column">
     <img src="">
   </div>
  </div>

  <div class="container">
    &nbsp;
  </div>

  <br>
  <br> 
</div>
</template>
<script>
import "../assets/home.scss";
export default {
  name: "home",
  data: () => ({}),
  created() {
     document.title = `Graphite Writer BETA v${this.$parent.version} | Create Text Documents Online For Free`
  }
};
</script>
