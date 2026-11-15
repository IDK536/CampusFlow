import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ProjectHeader } from './components/project-header/ProjectHeader'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ToastStack } from './components/ui/ToastStack'
import { LoginPage } from './pages/login/LoginPage'
import { RoomsPage } from './pages/rooms/RoomsPage'
import { MyBookingsPage } from './pages/my-bookings/MyBookingsPage'
import { AdminBookingsPage } from './pages/admin-bookings/AdminBookingsPage'
import { AdminRoomsPage } from './pages/admin-rooms/AdminRoomsPage'
import { AdminStatsPage } from './pages/admin-stats/AdminStatsPage'

export const App = () => {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <div className="app-shell">
      {!isLogin && <ProjectHeader />}
      <main className={isLogin ? 'app-main app-main--bare' : 'app-main'}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminStatsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastStack />
    </div>
  )
}
