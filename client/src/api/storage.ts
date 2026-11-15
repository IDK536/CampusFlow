/** Обёртка над Web Storage: в тестах и приватных окнах падает на память, а не на исключение. */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const memory = (): KeyValueStorage => {
  const map = new Map<string, string>()
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  }
}

const probe = (factory: () => Storage | undefined): KeyValueStorage => {
  try {
    const storage = factory()
    if (!storage) return memory()
    const key = '__campusflow_probe__'
    storage.setItem(key, '1')
    storage.removeItem(key)
    return storage
  } catch {
    return memory()
  }
}

export const sessionStore: KeyValueStorage = probe(() =>
  typeof sessionStorage === 'undefined' ? undefined : sessionStorage,
)
export const localStore: KeyValueStorage = probe(() => (typeof localStorage === 'undefined' ? undefined : localStorage))

export const readJSON = <T>(storage: KeyValueStorage, key: string): T | null => {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export const writeJSON = (storage: KeyValueStorage, key: string, value: unknown): void => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    /* хранилище переполнено или запрещено — работаем без сохранения */
  }
}
