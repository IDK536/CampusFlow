/** Минимальная работа с JWT на клиенте: только чтение payload, подпись проверяет backend. */
export interface JwtPayload {
  sub?: string | number
  login?: string
  role?: string
  exp?: number
  iat?: number
}

const decodeSegment = (segment: string): string => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const encodeSegment = (value: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export const decodeJwt = (token: string): JwtPayload | null => {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(decodeSegment(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

/** Момент истечения токена в мс или null, если токен не JWT либо без exp (например, mock-token-student1). */
export const tokenExpiresAt = (token: string): number | null => {
  const exp = decodeJwt(token)?.exp
  return typeof exp === 'number' ? exp * 1000 : null
}

export const isTokenExpired = (token: string, now = Date.now()): boolean => {
  const expiresAt = tokenExpiresAt(token)
  return expiresAt !== null && expiresAt <= now
}

/** Для mock-бэкенда: токен в формате JWT без настоящей подписи. */
export const createUnsignedJwt = (payload: JwtPayload): string =>
  `${encodeSegment({ alg: 'none', typ: 'JWT' })}.${encodeSegment(payload)}.mock-signature`
