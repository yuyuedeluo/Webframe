import axios from 'axios'
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
})
export default http

import { useAuth } from '@/composables/useAuth'

export function buildHeadersStrict(base?: Record<string, string>): Headers {
  const h = new Headers()
  if (base) for (const [k, v] of Object.entries(base)) h.set(k, v)

  const { authHeader } = useAuth()
  const { Authorization } = authHeader() as { Authorization?: string }
  if (Authorization) h.set('Authorization', Authorization)

  return h
}