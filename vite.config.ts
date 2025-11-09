import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 讀取對應環境檔 (.env, .env.development, .env.production)
  const env = loadEnv(mode, process.cwd(), '')

  // 這樣就能安全取用 VITE_API_BASE
  const API_BASE = env.VITE_API_BASE

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `${API_BASE}`,      // ✅ 改成這裡
          changeOrigin: true,
          // 例如後端是 http://localhost:8000/api/...
          // 若你要讓 /api 自動對應到後端 /api，
          // 可以留著這行
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  }
})
