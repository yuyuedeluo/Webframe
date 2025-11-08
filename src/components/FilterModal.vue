<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

type Props = {
  open: boolean
  categories: string[]
  districts: string[]
  selectedCats: string[]
  selectedDists: string[]
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: { cats: string[]; dists: string[] }): void
}>()

// 在彈窗內使用的「暫存選擇」；按確定才回傳到父元件
const catsDraft = ref<string[]>([])
const distsDraft = ref<string[]>([])

function resetDraftFromProps() {
  catsDraft.value = [...props.selectedCats]
  distsDraft.value = [...props.selectedDists]
}

watch(() => props.open, (v) => {
  if (v) resetDraftFromProps()
})

// 關閉（不套用）
function close() { emit('close') }

// 確定（套用並關閉）
function confirm() {
  emit('confirm', { cats: [...catsDraft.value], dists: [...distsDraft.value] })
}

// 全選 / 全不選
function selectAllCats(all: boolean) {
  catsDraft.value = all ? [...props.categories] : []
}
function selectAllDists(all: boolean) {
  distsDraft.value = all ? [...props.districts] : []
}

// Esc 關閉
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" aria-label="篩選條件">
        <header class="modal-head">
          <h3>篩選條件</h3>
          <button class="icon-btn" @click="close" aria-label="關閉">×</button>
        </header>

        <div class="modal-body">
          <!-- 行政區 -->
          <section class="group">
            <div class="group-head">
              <span class="bar-title">行政區</span>
              <div class="actions">
                <button class="btn" @click="selectAllDists(true)">全選</button>
                <button class="btn" @click="selectAllDists(false)">全不選</button>
              </div>
            </div>
            <div class="checks">
              <label v-for="d in districts" :key="d" class="check">
                <input type="checkbox" :value="d" v-model="distsDraft" />
                <span>{{ d }}</span>
              </label>
            </div>
          </section>

          <!-- 類別 -->
          <section class="group">
            <div class="group-head">
              <span class="bar-title">類別</span>
              <div class="actions">
                <button class="btn" @click="selectAllCats(true)">全選</button>
                <button class="btn" @click="selectAllCats(false)">全不選</button>
              </div>
            </div>
            <div class="checks">
              <label v-for="c in categories" :key="c" class="check">
                <input type="checkbox" :value="c" v-model="catsDraft" />
                <span>{{ c }}</span>
              </label>
            </div>
          </section>
        </div>

        <footer class="modal-foot">
          <button class="btn primary" @click="confirm">確定</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* 背景遮罩（點擊遮罩關閉） */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: grid; place-items: center;
  z-index: 1000;
}

/* 彈窗外觀 */
.modal {
  width: min(720px, 92vw);
  max-height: 80vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  font-family: "Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif;
}

.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1rem; border-bottom: 1px solid #eef2f5;
}
.modal-head h3 { margin: 0; font-size: 1.05rem; color: #2b3338; }
.icon-btn {
  border: none; background: transparent; font-size: 1.35rem; line-height: 1;
  cursor: pointer; color: #7a8791;
}
.icon-btn:hover { color: #2b3338; }

.modal-body {
  padding: 1rem; overflow: auto; display: grid; gap: 1rem;
}

.group { display: grid; gap: .5rem; }
.group-head { display: flex; align-items: center; justify-content: space-between; }
.bar-title { font-size: .95rem; color: #475259; font-weight: 600; }
.actions { display: inline-flex; gap: .5rem; }
.btn {
  font-size: .85rem; padding: .35rem .65rem;
  border-radius: 8px; border: 1px solid #d7dee3; background: #5ab4c5;
  cursor: pointer;
}
.btn.primary { border-color: #5ab4c5; background: #5ab4c5; color: #fff; }
.btn.primary:hover { filter: brightness(.95); }

.checks { display: flex; flex-wrap: wrap; gap: .5rem .75rem; }
.check { display: inline-flex; align-items: center; gap: .35rem;
  font-size: .95rem; color: #333; }
.check input { accent-color: #2c9ae0; }

.modal-foot {
  display: flex; justify-content: flex-end; gap: .5rem;
  padding: .75rem 1rem; border-top: 1px solid #eef2f5;
}
</style>
