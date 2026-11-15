import axios, { AxiosError } from 'axios'
import type { ErrorBody } from './types'
import { getAccessToken } from './session'

/** Ошибка API в едином формате {code, message, details} + HTTP-статус. */
export class ApiError extends Error {
  status: number
  code: string
  details: Record<string, unknown> | null

  constructor(status: number, body: ErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.details = body.details ?? null
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError

const FALLBACK_MESSAGES: Record<number, string> = {
  400: 'Проверьте введённые данные',
  401: 'Требуется вход в систему',
  403: 'Недостаточно прав для этого действия',
  404: 'Не найдено',
  409: 'Конфликт данных',
  500: 'Ошибка на сервере, попробуйте ещё раз',
}

/** Код пустого административного 404: доступ не подтверждён (вместо 403 из DOCX). */
export const ADMIN_UNAVAILABLE = 'ADMIN_UNAVAILABLE'

const isAdminPath = (url = '') => /^\/?admin(\/|$)/.test(url)

const toApiError = (error: AxiosError<Partial<ErrorBody>>): ApiError => {
  if (!error.response) {
    return new ApiError(0, { code: 'NETWORK_ERROR', message: 'Сервер недоступен. Проверьте, запущен ли backend' })
  }
  const { status, data } = error.response
  const body = data && typeof data === 'object' ? data : {}
  // Административные методы до подтверждения роли отвечают пустым 404 без причины.
  // Это не «не найдено», а отказ: показываем нейтральное сообщение и refresh не запускаем.
  if (status === 404 && !body.code && isAdminPath(error.config?.url)) {
    return new ApiError(404, { code: ADMIN_UNAVAILABLE, message: 'Операция недоступна' })
  }
  return new ApiError(status, {
    code: body.code ?? (status >= 500 ? 'INTERNAL_ERROR' : `HTTP_${status}`),
    message: body.message ?? FALLBACK_MESSAGES[status] ?? `Ошибка ${status}`,
    details: body.details ?? null,
  })
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  // Refresh-cookie — HttpOnly; браузер сам отправляет её на /auth/refresh и /auth/logout.
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  // refresh/logout не должны зависеть от действительного access, поэтому на /auth/* его не шлём.
  const token = getAccessToken()
  if (token && !config.url?.startsWith('/auth/')) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<ErrorBody>>) => Promise.reject(toApiError(error)),
)
