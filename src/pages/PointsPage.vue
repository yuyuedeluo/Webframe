<script setup>
import { ref, onUnmounted } from 'vue'

const isActive = ref(false)
const showPlus = ref(false)
const randomX = ref(0)
const randomDir = ref(1)
let intervalId = null

function toggleColor() {
  isActive.value = !isActive.value
  if (isActive.value) startFloating()
  else stopFloating()
}

function startFloating() {
  intervalId = setInterval(() => {
    randomX.value = Math.random() * 100 + 50 // 左右漂浮幅度
    randomDir.value = Math.random() > 0.5 ? 1 : -1 // 隨機方向
    showPlus.value = true
    setTimeout(() => (showPlus.value = false), 3500)
  }, 5000)
}

function stopFloating() {
  clearInterval(intervalId)
  intervalId = null
  showPlus.value = false
}

onUnmounted(() => stopFloating())
</script>

<template>
  <div class="btn" :class="{ active: isActive }">
    <!-- +1 漂浮效果 -->
    <transition name="float">
      <div
        v-if="showPlus"
        class="plusOne"
        :style="{ '--x': randomX + 'px', '--dir': randomDir }"
      >
        +1
      </div>
    </transition>

    <!-- 主按鈕 -->
    <button 
      class="go-button" 
      :class="{ active: isActive }" 
      @click="toggleColor">
      GO
      <span v-if="isActive" class="pulse layer1"></span>
      <span v-if="isActive" class="pulse layer2"></span>
    </button>
  </div>
</template>

<style scoped>
/* --- 背景 --- */
.btn {
  position: relative;
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #4aa1b2, #e8f6f8, #4aa1b2);
  opacity: 0;
  transition: opacity 1.8s ease-in-out;
  z-index: 0;
}

.btn.active::before {
  opacity: 1;
  animation: breathing 5s ease-in-out infinite;
}

@keyframes breathing {
  0% { filter: brightness(0.9); }
  50% { filter: brightness(1.05); }
  100% { filter: brightness(0.9); }
}

/* --- 按鈕 --- */
.go-button {
  position: relative;
  overflow: visible;
  width: 80vw;
  height: 15vh;
  font-size: 50px;
  font-weight: bold;
  color: white;
  background-color: gray;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.8s ease-in-out;
  z-index: 2;
}

.go-button.active {
  background-color: #5ab4c5;
  filter: brightness(1);
}

/* --- +1 漂浮 --- */
.plusOne {
  position: absolute;
  bottom: 50%; /* 從按鈕中間開始 */
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  opacity: 0;
  animation: floatDrift 5s ease-in-out forwards;
  z-index: 0;
}

/* 飄浮動畫 — 垂直上升 + 左右漂浮 */
@keyframes floatDrift {
  0% {
    /* transform: translate(0, 0); */
    transform: translate(calc(var(--dir) * var(--x) * 0.5), 0vh);
    opacity: 0;
  }
  
  30% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--dir) * var(--x) * 1.5), -60vh);
    opacity: 1;
  }
  /* 100% {
    transform: translate(calc(var(--dir) * var(--x)), -40vh);
    opacity: 0;
  } */
}

/* --- 心跳漣漪 --- */
.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  animation: pulseWave 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.layer2 {
  animation-delay: 1.5s;
}

@keyframes pulseWave {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.8; }
  25% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0.4; }
  75% { transform: translate(-50%, -50%) scale(2.1); opacity: 0.2; }
  100% { transform: translate(-50%, -50%) scale(2.7); opacity: 0; }
}
</style>
