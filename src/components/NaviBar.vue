<template>
  <nav class="navi-bar">
    <ul class="navi-list">
      <li class="navi-item" :class="{ active: activeTab === 'home' }">
        <a href="#home" @click.prevent="setActive('home')">運動累點</a>
      </li>
      <li class="navi-item" :class="{ active: activeTab === 'about' }">
        <a href="#about" @click.prevent="setActive('about')">兌換點數</a>
      </li>
      <li class="navi-item" :class="{ active: activeTab === 'services' }">
        <a href="#services" @click.prevent="setActive('services')">排行榜</a>
      </li>
    </ul>
    <div class="slider" :style="sliderStyle"></div>
    <div class="line" :style="line"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'home'|'about'|'services'>('home')
function setActive(tab: 'home'|'about'|'services') {
  activeTab.value = tab
}

// 依 activeTab 計算底線位移（3 等分 => 0%, 100%, 200%）
const indexMap = { home: 0, about: 1, services: 2 } as const
const sliderStyle = computed(() => {
  const i = indexMap[activeTab.value]
  return { transform: `translateX(${i * 100}%)` }
})
</script>

<style scoped>
/* --- 導覽列 --- */
.navi-bar {
  font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;  position: relative;              /* 讓 slider 能定位在底部 */
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  border-bottom: 1px solid #e0e0e0;
}

/* --- 平均三等分 --- */

.navi-list {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  list-style: none;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  padding: 0.5rem 1rem;
  padding-bottom: 0;
}

.navi-item {
  flex: 1;                /* 🔹 平均分配空間 */
  text-align: center;     /* 🔹 內容置中 */
  margin-bottom: .75rem;
}

.navi-item a {
  color: #475259; /* 預設灰色文字 */
  text-decoration: none; 
  font-weight: 400; 
  font-size: 1rem;
  transition: color 0.25s ease;
  outline: none;          /* 🔹 取消按下時的外框 */
  -webkit-tap-highlight-color: transparent;
}

.navi-item a:hover { color: #5ab4c5; }

/* --- Active 狀態 --- */
.navi-item.active a {
  color: #5ab4c5;
}

/* --- 底部滑動線 --- */

/* 底線灰色背景 */
.line {
  position: absolute;
  bottom: 0;           /* 🔹 貼到底部 */
  left: 0;
  width: 100%;
  height: 0.05rem;
  background-color: #adb8be;
}

/* slider 緊貼在灰線上方 */
.slider {
  position: absolute;
  bottom: 0.05rem;    /* 🔹 高度剛好讓 slider 緊貼在灰線上方 */
  left: 1rem;
  height: 0.15rem;    /* 2px */
  width: calc((100% - 2rem) / 3); /* 🔹 三等分寬度（扣掉左右邊距） */
  background-color: #5ab4c5;
  transition: transform 0.3s ease;
}
</style>
