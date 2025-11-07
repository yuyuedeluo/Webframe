<template>
  <nav class="navi-bar">
    <ul class="navi-list">
      <li class="navi-item"><a href="#home">Home</a></li>
      <li class="navi-item"><a href="#about">About</a></li>
      <li class="navi-item"><a href="#services">Services</a></li>
      <li class="navi-item"><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.navi-bar {
  background-color: #000000;
  padding: 2rem;
}
.navi-list {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
.navi-item a {
  color: rgb(255, 0, 0);
  text-decoration: none;
}
</style>
