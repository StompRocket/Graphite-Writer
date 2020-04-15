<template>
  <footer class="footer">

    <div class="container">

      <div class="brand--row">
        <img class="brand--wordmark" src="../assets/wordmark.svg" alt="">
        <p>v{{version}}</p>
        <Locale></Locale>
      </div>
      <div class="about--row">
        <p>{{$t("footer.languageDisclaimer")}} <br> {{$t("footer.languageAsk")}}: <a href="mailto:support@graphitewriter.com">support@graphitewriter.com</a>.</p>
        <p>{{$t("footer.freeAndOpenSource")}} <a target="_blank" href="ronanfuruta.com">Ronan Furuta</a></p>
        <p>{{$t("footer.questionsAndSuggestions")}} <a href="mailto:support@graphitewriter.com">support@graphitewriter.com</a></p>
        <p>{{$t("footer.github")}}
          <a target="_blank" href="https://github.com/StompRocket/Graphite-Writer">Github</a></p>
        <small>{{$t("footer.legal")}} <a @click="logTermsClick" target="_blank" href="https://graphitewriter.com/termsofservice">{{$t("footer.tos")}}</a> {{$t("footer.and")}} <a @click="logPrivacyClick" target="_blank" href="https://graphitewriter.com/privacy">{{$t("footer.pp")}}</a></small>
      </div>
    </div>
  </footer>
</template>
<script>
  import Locale from "./locale"
const version = require("../../package").version
  export default {
    name: "Footer",
    components: {Locale},
    data() {
      return {
        version: version
      }
    },
    methods: {
      logPrivacyClick() {
        this.$analytics.logEvent("privacyPolicyClicked")
      },
      logTermsClick() {
        this.$analytics.logEvent("termsOfServiceClicked")
      },
    }
  }
</script>