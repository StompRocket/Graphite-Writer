<template>
  <div class="local">

    <select  class="input " v-model="$i18n.locale" @change="storeLocal">
      <option value="en">English</option>
      <option value="pt">Português (BETA)</option>
    </select>
    <i class="fas fa-language"></i>
  </div>
</template>
<script>
  export default {
    name: "locale",
    methods: {
      storeLocal() {
        console.log(this.$i18n.locale)
        window.localStorage.setItem("local", this.$i18n.locale)
        if (this.$analytics) {
          this.$analytics.setUserProperties({local: this.$i18n.locale})
          this.$analytics.logEvent("setLocal", {local: this.$i18n.locale})
        }
        if (this.$store.getters.fbToken) {
          fetch(`${this.$store.getters.api}/api/v1/user`, {
            method: "post",
            headers: {
              "Authorization": this.$store.getters.fbToken,
              "content-type": "application/json"
            },
            body: JSON.stringify({locale: this.$i18n.locale})

          }).then(res => res.json()).then(res => {

            console.log("weblocale updated")

          })
        }

      },
    }
  }
</script>