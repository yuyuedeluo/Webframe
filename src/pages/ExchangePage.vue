<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 後端位址：若已設 vite 代理，API_BASE 可留空字串 ''（用相對路徑 /api/merch）
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined
const MERCH_URL = `${API_BASE ?? ''}/api/merch`

type MerchRow = {
  id: number
  productname: string
  price: number
  pictureURL: string
}

type Product = {
  id: number
  name: string
  points: number
  image: string
  food: boolean
  travel: boolean
  entertain: boolean
}

/* ============ 狀態 ============ */
const currentTag = ref<'all' | 'food' | 'travel' | 'entertain'>('all')
const showDialog = ref(false)
const success = ref(false)
const selectedProduct = ref<Product | null>(null)

const products = ref<Product[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

/* ============ 工具：分類 / 圖片路徑 ============ */
// 依商品名（或來源欄位）自動推斷分類；若後端未提供分類，可用這個
function classifyByName(name: string) {
  const s = name.toLowerCase()
  const food =
    /星巴克|飲|餐|餐廳|food|coffee|meal/.test(name) || /food/.test(s)
  const travel =
    /車票|高鐵|租車|出行|travel|ticket|train|car/.test(name) || /travel/.test(s)
  const entertain =
    /電影|樂園|遊樂|entertain|movie|park/.test(name) || /entertain/.test(s)
  return { food, travel, entertain }
}

// 後端回來的 pictureURL 可能是：
// 1) 'assets/image1.png'（前端 public 資料夾）→ 用 '/assets/...'
// 2) 後端靜態檔案 '/static/..' → 直接 `${API_BASE}/static/...`
// 3) 完整 http(s) URL → 原樣回傳
function normalizeImg(url: string) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) {
    // 後端絕對路徑
    return `${API_BASE ?? ''}${url}`
  }
  // 相對 assets：放在前端 public/assets 下
  return `/` + url.replace(/^\.?\/*/, '') // 確保以 / 開頭
}

/* ============ 讀取資料 ============ */
async function loadMerch() {
  loading.value = true
  errorMsg.value = null
  try {
    const r = await fetch(MERCH_URL, { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    // 後端格式：{ "data": MerchRow[] }
    const j = await r.json() as { data: MerchRow[] }
    const rows = Array.isArray(j.data) ? j.data : []

    products.value = rows.map(row => {
      const tags = classifyByName(row.productname ?? '')
      return {
        id: row.id,
        name: row.productname,
        points: row.price,
        image: normalizeImg(row.pictureURL),
        ...tags,
      } as Product
    })
  } catch (err: any) {
    errorMsg.value = err?.message ?? '讀取失敗'
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadMerch)

/* ============ 篩選 / 對話框 ============ */
const setFilter = (tag: 'all' | 'food' | 'travel' | 'entertain') => {
  currentTag.value = tag
}

const filteredProducts = computed(() => {
  if (currentTag.value === 'all') return products.value
  return products.value.filter(p => p[currentTag.value])
})

const openConfirm = (p: Product) => {
  selectedProduct.value = p
  success.value = false
  showDialog.value = true
}
const closeDialog = () => { showDialog.value = false }

const confirmRedeem = async () => {
  // 這裡可改成呼叫後端兌換 API；先做前端示意
  success.value = true
  setTimeout(() => (showDialog.value = false), 2000)
}
</script>
