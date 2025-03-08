// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { SignInScreen, DashboardScreen } from '@/screens'
import { useAuth } from '@/contexts/AuthProvider'
import { ViewsProvider } from '@/contexts/ViewsProvider'

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
    <Navigate to="/admin/home" replace />
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
          path="/admin/:menuId?"
          element={
            <PrivateRoute>
              <ViewsProvider>
                <DashboardScreen />
              </ViewsProvider>
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
