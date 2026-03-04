const cacheStore = new Map()

export const getCache = (key) => {
  const item = cacheStore.get(key)
  if (!item) return null
  if (Date.now() > item.expiresAt) {
    cacheStore.delete(key)
    return null
  }
  return item.value
}

export const setCache = (key, value, ttlMs = 15000) => {
  cacheStore.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export const clearCacheByPrefix = (prefix) => {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) cacheStore.delete(key)
  }
}
