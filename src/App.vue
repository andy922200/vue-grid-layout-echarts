<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <VueGridLayout />
  </div>
</template>

<script>
import VueGridLayout from './components/VueGridLayout.vue'

export default {
  name: 'App',
  components: {
    VueGridLayout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
  box-sizing: border-box;
}
</style>
