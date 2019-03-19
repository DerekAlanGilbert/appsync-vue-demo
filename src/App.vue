<template>
  <div id="app">
    <demo-page v-if="hydrated"></demo-page>
  </div>
</template>

<script>
  import DemoPage from '@/components/demoPage'

  export default {
    name: 'app',
    async mounted() {
      await this.$apollo.provider.defaultClient.hydrated()
      this.hydrated = true
    },
    data() {
      return {
        hydrated: false
      }
    },
    components: {
      DemoPage
    }
  }

</script>


<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
  }
  #app {
    padding: 40px;
  } 
</style>
