import type { Booking, Room } from '../api/types'

/**
 * CSV для Excel с русской локалью: разделитель «;», BOM для кириллицы, CRLF между строками.
 */
const escapeCell = (value: unknown): string => {
  const text = value === null || value === undefined ? '' : String(value)
  // Защита от CSV-инъекций: Excel исполняет ячейки, начинающиеся с = + - @.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[";\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

const STATUS_LABEL = { active: 'активна', cancelled: 'отменена' } as const

export const bookingsToCsv = (bookings: Booking[], rooms: Room[] = []): string => {
  const building = new Map(rooms.map((r) => [r.id, r.building]))
  const header = ['ID', 'Аудитория', 'Корпус', 'Дата', 'Начало', 'Конец', 'Пользователь', 'Статус', 'Комментарий']
  const rows = bookings.map((b) => [
    b.id,
    b.roomName,
    building.get(b.roomId) ?? '',
    b.date,
    b.startTime,
    b.endTime,
    b.userDisplayName,
    STATUS_LABEL[b.status],
    b.comment,
  ])
  return '﻿' + [header, ...rows].map((row) => row.map(escapeCell).join(';')).join('\r\n')
}

export const downloadText = (filename: string, content: string, type = 'text/csv;charset=utf-8'): void => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
