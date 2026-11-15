import type { Role } from '../api/types'

/** Пользователи из seed: пароль совпадает с логином. Нужны для быстрого входа на демо. */
export const DEMO_USERS: { login: string; displayName: string; role: Role; hint: string }[] = [
  { login: 'student1', displayName: 'Иван Студентов', role: 'student', hint: 'бронирует и отменяет свои брони' },
  { login: 'student2', displayName: 'Мария Студентова', role: 'student', hint: 'второй студент — для проверки конфликта' },
  { login: 'admin', displayName: 'Администратор Пупкин', role: 'admin', hint: 'видит все брони, ведёт справочник' },
]

export const ROLE_LABEL: Record<Role, string> = { student: 'Студент', admin: 'Администратор' }

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
