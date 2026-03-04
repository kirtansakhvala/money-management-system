import axios from "axios"
import { getCache, setCache, clearCacheByPrefix } from "../utils/cache"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const apiGet = async (url, params = {}) => {
  const key = `${url}?${JSON.stringify(params)}`
  const cached = getCache(key)
  if (cached) return cached
  const { data } = await api.get(url, { params })
  setCache(key, data)
  return data
}

export const authApi = {
  register: (payload) => api.post("/register", payload),
  login: (payload) => api.post("/login", payload),
}

export const dashboardApi = {
  summary: (mode = "total") => apiGet("/reports/summary", { mode }),
}

export const incomeApi = {
  add: (payload) =>
    api.post("/income", payload).then((res) => {
      clearCacheByPrefix("/reports")
      clearCacheByPrefix("/income")
      return res
    }),
  list: (params) => apiGet("/income", params),
}

export const expenseApi = {
  add: (payload, imageFile = null) => {
    const formData = new FormData()
    formData.append("amount", payload.amount)
    formData.append("category", payload.category)
    formData.append("note", payload.note || "")
    formData.append("date", payload.date)
    if (imageFile) formData.append("image", imageFile)

    return api.post("/expense", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      clearCacheByPrefix("/reports")
      clearCacheByPrefix("/expense")
      return res
    })
  },
  list: (params) => apiGet("/expense", params),
  remove: (id) =>
    api.delete(`/expense/${id}`).then((res) => {
      clearCacheByPrefix("/reports")
      clearCacheByPrefix("/expense")
      return res
    }),
}

export const budgetApi = {
  set: (payload) => api.post("/budget", payload),
  get: () => apiGet("/budget"),
}

export const reportsApi = {
  analytics: (from, to) => apiGet("/reports/analytics", { from, to }),
}
