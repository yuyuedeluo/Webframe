<script setup>
import { onMounted } from 'vue'
import NaviBar from './components/NaviBar.vue'
import MapView from './components/MapView.vue'
  
onMounted(() => {
  console.log('App component mounted')
})
</script>

<template>
  <div id="app">
    <NaviBar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
l{
  color: red;
}
</style>

