<template>
<div class="page home">
  <div class="banner-image">
  	<div class="container">
  		<div class="center-box">
	  		<h1 class="big" style="margin-bottom: 0; padding-bottom: 0;"><b>Graphite Writer</b> v2</h1>
	  		<h2 style="margin-bottom: 1em; font-weight: 500;">A Modern Document Editor Focused On Speed And Usability</h2>
	  		<router-link class="button dark" to="/login">Start Now</router-link>
        <a  class="button dark"  @click="toggleVideo"><i class="fas fa-play"></i> Watch</a>
	  	</div>
  	</div>
  </div>

  <div class="container white">
    <br />
    <br />
    <p class="blurb">From the beginning we noticed a problem, text editors were either fast or cloud-based, not both. We built Graphite Writer to solve this problem. Graphite Writer was designed from the ground up as a fast, easy to use, and secure text editor. All your documents are saved in the cloud instantly and can be accessed from anywhere. </p>
    
    <br>
    <br>

    <div class="row threeFeatures">
      <div class="column center">
        <span class="underline-warning">
          <h3>Speed</h3>

        </span>
        <p>Graphite Writer was developed with speed in mind, achieving much faster loading times than other cloud based alternatives. Graphite Writer has been clocked up to 10 seconds faster than similar programs.</p>
      </div>
      <div class="column center">
        <span class="underline-warning">
          <h3>Usability</h3>
        </span>

        <p>Graphite Writer was designed for ease of use, not computer whizzes. We pride ourselves on Graphite Writer's accessibility. In addition, if you see a problem or something you would like changed, we are always willing to consider suggestions.</p>
      </div>
      <div class="column center">
        <span class="underline-warning">
          <h3>Security</h3>
        </span>
        <p>At Graphite Writer we respect your privacy, we encrypt all of your data, and never sell it to third parties.</p>
      </div>
    </div>
    <h2 class="sectionHeading">Over 150 satisfied users</h2>
<carousel :perPage="1">
  <slide>
    <div class="testamonialContainer">
      <q>Graphite Writer combines the features and usability of programs such as Microsoft Word or Google Docs with a speed and simplicity unparalleled by competitors.</q>
      <p> - Sam M.</p>
    </div>
  </slide>
  <slide>
   <div class="testamonialContainer">
      <q>Loads like a million times faster</q>
      <p> - Max H.</p>
    </div>
  </slide>
  <slide>
    <div class="testamonialContainer">
      <q>A fantastic tool. I would never use any other.</q>
      <p> -Jack K.</p>
    </div>
  </slide>
  
</carousel>
     
   
    <h2 class="sectionHeading">Real Time Sharing</h2>
    <p class="blurb">In Graphite Writer version 2 you can now share documents in real time. After months at the drawing board, we have designed a custom database that allows for incredibly fast real-time sharing. Our average document load time is just under 500 milliseconds, while similar programs struggle with 10 second loading times.</p>

  </div>
<div  @click="toggleVideo" :class="{open: videoModal}" class="modal">
  <button class="closeBtn"><i class="fas fa-times-circle"></i></button>
  <div class="modal-content">
  <div class="video-modal">
    <div style="padding:42.5% 0 0 0;position:relative;">
      <iframe src="https://player.vimeo.com/video/268322197" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
    </div>
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
import '../assets/home.scss';
import '../assets/player.js';

export default {
  name: 'home',
   
  data: () => ({
    videoModal: false,
    flickityOptions: {
      initialIndex: 1,
      prevNextButtons: true,
      pageDots: false,
      wrapAround: true

      // any options from Flickity can be used
      }
  }),
  created() {
    document.title = `Graphite Writer BETA v${
      this.$parent.version
    } | Create Text Documents Online For Free`;
  },
  methods: {
    toggleVideo() {
      if (this.videoModal) {
        this.videoModal = false;
      } else {
        this.videoModal = true;
      }
    }
  }
};
</script>
