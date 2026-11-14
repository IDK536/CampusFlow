import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Role } from '../../api/types'
import { useAppSelector } from '../../redux/hooks'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: Role[]
}

/** Скрывает экраны по роли. Настоящая проверка прав — на API; 403 всё равно придёт тостом. */
export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const user = useAppSelector((s) => s.auth.user)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
