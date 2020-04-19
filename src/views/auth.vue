<template>
  <div class="home page">
    <nav class="nav">
      <img class="brand--wordmark" src="@/assets/wordmark.svg" />

      <Locale></Locale>
    </nav>
    <div class="authScreen">
      <div class="authWindow">
        <img src="../assets/undraw_my_password_d6kg.svg" alt="Password Image" />
        <h1>{{ $t('login.title') }}</h1>
        <p>{{ $t('login.instructions') }}</p>

        <button @click="login" class="btn">
          <i class="fab fa-google"></i>
          {{ $t('login.button') }}
        </button>
        <Locale v-if="prominentLocale"></Locale>
      </div>
    </div>

    <div v-if="!loaded" class="loading">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      <img src="@/assets/wordmark.svg" alt />
      <p class="version">v{{ version }}</p>
    </div>

    <div v-if="featureModal" class="modal_container">
      <div class="modal--feature">
        <img src="../assets/undraw_around_the_world_v9nu.svg" alt />
        <h3>{{ $t('feature.new') }}</h3>
        <p>{{ $t('feature.supports') }}</p>
        <p>{{ $t('feature.translate') }}</p>
        <p>
          {{ $t('feature.support') }}:
          <a
            href="mailto:support@graphitewriter.com"
          >support@graphitewriter.com</a>
        </p>
        <p>{{ $t('feature.useBox') }}</p>
        <Locale></Locale>
        <button @click="closeFeatureModal" class="btn">{{ $t('ok') }}</button>
      </div>
      <div class="modal_container" @click="closeFeatureModal"></div>
    </div>
  </div>
</template>

<script>
import Locale from "@/components/locale.vue";

let timeout = null;
export default {
  name: "Auth",

  data() {
    return {
      featureModal: false,
      prominentLocale: this.$config.getValue("prominentLocalDisplay") == "true",

      loaded: false,

      version: require("../../package.json").version,
      trace: this.$perf.trace("openAuthScreen")
    };
  },
  created() {
    this.trace.start();
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    closeFeatureModal() {
      this.featureModal = false;
      if (this.$analytics) {
        this.$analytics.logEvent("closedLanguageFeature");
      }
      localStorage.setItem("languageFeature", "true");
    },
    login() {
      if (this.$analytics) {
        this.$analytics.logEvent("login");
      }
      this.$firebase.auth().useDeviceLanguage();
      var provider = new this.$firebase.auth.GoogleAuthProvider();

      this.$firebase
        .auth()
        .signInWithRedirect(provider)
        .catch(err => {
          this.$swal({
            title: this.$t("error"),
            text: this.$t("ErrorTypes.signin.text"),
            icon: "error",
            button: this.$t("ok")
          });
        });
    }
  },
  components: { Locale },
  mounted() {
    if (this.$analytics) {
      this.$analytics.logEvent("openedAuthPage");
    }
    this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setUser", user);
        if (this.$route.name == "Auth") {
          this.$router.push("/");
        }
      } else {
        this.loaded = true;
        this.$store.commit("setUser", false);

        // No user is signed in.
        console.log(this.$route.name);
      }
    });
  }
};
</script>
