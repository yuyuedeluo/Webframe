<script setup>
import { onMounted } from 'vue'
import NaviBar from './components/NaviBar.vue'

onMounted(() => {
  console.log('App component mounted')
})
</script>

<template>
  <div id="app">
    <NaviBar />
    <main>
      <h1>Welcome to the Vue.js Application</h1>
      <p>This is the main content area.</p>
    </main>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
</style>

