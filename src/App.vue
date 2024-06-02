<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from './components/MainContent.vue';

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
