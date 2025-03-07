// src/routes.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthProvider'
import { SignInScreen, DashboardScreen } from '@/screens'

interface RouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Carregando...</div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/entrar" replace />
}

const PublicRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Carregando...</div>
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  )
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/entrar"
          element={
            <PublicRoute>
              <SignInScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardScreen />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/entrar" />} />
        <Route path="*" element={<Navigate to="/entrar" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
