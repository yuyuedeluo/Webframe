<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const API_BASE = import.meta.env.VITE_API_BASE as string
const API_PATH = '/api/pressence'   // 若後端是 /api/pressence，改成 '/api/pressence'
const POLL_MS = 5000
const POINTS_URL = `${API_BASE}/api/points/me`


const isActive = ref(false)
const showPlus = ref(false)
const randomX = ref(0)
const randomDir = ref(1)

const score = ref(0)
const ANIM_COOLDOWN_MS = 4000
let lastAnimAt = 0

let pollId: number | null = null
let hidePlusTid: number | null = null

function toggleColor() {
  if (isPolling()) stopAll()
  else {
    isActive.value = true            // << 先亮起
    startAll()  
  }
}

// 開始輪詢
function startAll() {
  // 先拿目前分數
  fetchPoints().catch((e) => { console.error(e); stopAll() })
  // 再開始輪詢
  pollOnce()
  pollId = window.setInterval(pollOnce, POLL_MS)
}


// 停止輪詢 + 停止所有動畫
function stopAll() {
  if (pollId) { clearInterval(pollId); pollId = null }
  stopFloating()
  isActive.value = false
}

// 是否正在輪詢
function isPolling() {
  return pollId !== null
}

// 停止「+1」動畫
function stopFloating() {
  if (hidePlusTid) { clearTimeout(hidePlusTid); hidePlusTid = null }
  showPlus.value = false
}

async function fetchPoints() {
  const { authHeader } = useAuth()
  const r = await fetch(POINTS_URL, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  })
  if (!r.ok) throw new Error(`points GET HTTP ${r.status}`)

  // Swagger 標成 "string"，這裡做兼容解析
  const raw = await r.text()
  try {
    const j = JSON.parse(raw)
    if (typeof j === 'number') { score.value = j; return }
    if (j && typeof j.points === 'number') { score.value = j.points; return }
  } catch {}
  // 純數字字串
  const n = Number(raw)
  score.value = Number.isFinite(n) ? n : 0
}

// 單次輪詢
async function pollOnce() {
  try {
    const { authHeader } = useAuth()

    // 取得目前定位（Promise 版本）
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('此裝置不支援地理定位'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
      })
    })

    const payload = {
      user_id: 'USER_001', // 需要的話換成實際使用者 id
      lng: pos.coords.longitude,
      lat: pos.coords.latitude,
      timestamp: new Date().toISOString(),
    }

    const res = await fetch(`${API_BASE}${API_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data: {
      status: 'success' | 'error'
      inRange: boolean
      data?: { name: string; type: string; lng: number; lat: number; dist_m: number }
    } = await res.json()

    if (!data.inRange) {
      // ❌ 不在範圍內：打斷所有動畫
      stopAll()
      isActive.value = false
      return
    }

    //isActive.value = true
    triggerPlusOne()
    // 重新向後端拿最新分數（或你也可先本地 +1 再同步）
    try { await fetchPoints() } catch (e) { console.error(e); stopAll() }

  } catch (e) {
      console.error('presence 請求失敗：', e)
      stopAll() // 停動畫並取消輪詢
    }
}


// 觸發一次 +1 漂浮動畫
function triggerPlusOne() {
  const now = Date.now()
  if (now - lastAnimAt < ANIM_COOLDOWN_MS) return  // ← 節流：4 秒內只播一次
  lastAnimAt = now

  randomX.value = Math.random() * 100 + 50
  randomDir.value = Math.random() > 0.5 ? 1 : -1
  showPlus.value = true
  if (hidePlusTid) clearTimeout(hidePlusTid)
  hidePlusTid = window.setTimeout(() => (showPlus.value = false), 3500)
}

onMounted(() => {
  fetchPoints().catch((e) => {
    console.error(e)
    // 如果抓分數失敗，不影響頁面顯示，但你也可選擇 stopAll()
  })
})
</script>

<template>
  <div class="btn" :class="{ active: isActive }">
    <!-- 分數顯示 -->
    <div class="score">{{ score }}</div>

    <!-- +1 漂浮效果 -->
    <transition name="float">
      <div
        v-if="showPlus"
        class="plusOne"
        :style="{ '--x': randomX + 'px', '--dir': randomDir as any }"
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

.score {
  position: absolute;
  top: 15%;
  font-size: 96px;
  font-weight: bold;
  color: #333;
  z-index: 1;
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
  background-color: #58d2eb;
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
    transform: translate(calc(var(--dir) * var(--x) * 0.5), 0vh);
    opacity: 0;
  }
  30% { opacity: 1; }
  100% {
    transform: translate(calc(var(--dir) * var(--x) * 1.5), -60vh);
    opacity: 1;
  }
}

/* --- 心跳漣漪 --- */
.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220%;
  height: 220%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  animation: pulseWave 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.layer2 { animation-delay: 1.5s; }

@keyframes pulseWave {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.8; }
  25% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0.4; }
  75% { transform: translate(-50%, -50%) scale(2.1); opacity: 0.2; }
  100% { transform: translate(-50%, -50%) scale(2.7); opacity: 0; }
}
</style>
