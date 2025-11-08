<template>
  <nav class="navi-bar">
    <ul class="navi-list">
      <li class="navi-item" :class="{ active: route.name === 'located' }">
        <RouterLink to="/located">運動地點</RouterLink>
      </li>
      <li class="navi-item" :class="{ active: route.name === 'home' }">
        <RouterLink to="/home">運動累點</RouterLink>
      </li>
      <li class="navi-item" :class="{ active: route.name === 'about' }">
        <RouterLink to="/about">兌換點數</RouterLink>
      </li>
      <li class="navi-item" :class="{ active: route.name === 'services' }">
        <RouterLink to="/services">排行榜</RouterLink>
      </li>
    </ul>

    <!-- 滑動底線 + 灰線 -->
    <div class="slider" :style="sliderStyle"></div>
    <div class="line"></div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 四等分 slider：寬度 = (100% - 2rem)/4，位移依 meta.idx
const sliderStyle = computed(() => {
  const idx = (route.meta?.idx as number) ?? 0
  return {
    transform: `translateX(calc(${idx} * 100%)`,
  }
})
</script>

<style scoped>
.navi-bar {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
  border-bottom: 1px solid #e0e0e0;
  font-family: "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
}

.navi-list {
  display: flex;
  margin: 0;
  padding: 0.5rem 1rem; /* ← 與 slider 的左右留白一致 */
  padding-bottom: 0;
  list-style: none;
}

.navi-item { flex: 1; text-align: center; margin-bottom: .75rem; }

/* RouterLink 與 a 樣式一致 */
.navi-item a {
  display: block;
  color: #475259;
  text-decoration: none;
  font-weight: 400;
  font-size: 1rem;
  padding: .5rem .25rem;
  transition: color .25s ease, background-color .25s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.navi-item a:hover { color: #5ab4c5; }
.navi-item.active a { color: #5ab4c5; }

/* 底部灰線 */
.line {
  position: absolute; left: 0; right: 0; bottom: 0;
  height: .05rem;
  background: #adb8be;
}

/* 滑動底線（與左右 padding 對齊） */
.slider {
  position: absolute;
  left: 1rem;                 /* 與上方 padding 對齊 */
  bottom: .05rem;             /* 緊貼灰線上方 */
  height: .15rem;
  width: calc((100% - 2rem) / 4);
  background: #5ab4c5;
  border-radius: 999px;
  transition: transform .3s ease;
}
</style>
