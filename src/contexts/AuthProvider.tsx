// src/contexts/AuthProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { App } from 'antd'
import { auth } from '@/firebase/config'
import {
  loginAdmin,
  logoutAdmin,
  resetPassword,
  completeFirstAccess,
  checkAdminStatus,
  getAdminByEmail
} from '@/services/auth'
import { IAdminProfile } from '@/types'

interface AuthContextData {
  admin: IAdminProfile | null
  isAuthenticated: boolean
  loading: boolean
  handleLogin: (email: string, password: string) => Promise<void>
  handleLogout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  completeFirstAccess: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()

  const [admin, setAdmin] = useState<IAdminProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const adminData = await checkAdminStatus(user.uid)
        if (adminData && !adminData.firstAccessPending) {
          setAdmin(adminData)
          setIsAuthenticated(true)
        } else {
          setAdmin(null)
          setIsAuthenticated(false)
        }
      } else {
        setAdmin(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await loginAdmin(email, password)
      const adminData = await checkAdminStatus(userCredential.user.uid)
      if (adminData && !adminData.firstAccessPending) {
        setAdmin(adminData)
        setIsAuthenticated(true)
        message.success('SignIn realizado com sucesso!')
      } else {
        throw new Error('FIRST_ACCESS_PENDING')
      }
    } catch (error: any) {
      if (error.message === 'FIRST_ACCESS_PENDING') {
        const pendingAdmin = await getAdminByEmail(email)
        if (pendingAdmin && pendingAdmin.firstAccessPending) {
          message.info('Primeiro acesso detectado. Complete seu cadastro.')
          throw error
        } else {
          message.error('Nenhum cadastro encontrado para este e-mail.')
        }
      } else {
        message.error(error.message || 'Erro ao fazer login.')
      }
      throw error
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    setAdmin(null)
    setIsAuthenticated(false)
    message.success('Logout realizado com sucesso!')
  }

  const handleResetPassword = async (email: string) => {
    await resetPassword(email)
    message.success('E-mail de recuperação enviado!')
  }

  const handleCompleteFirstAccess = async (
    email: string,
    password: string,
    name: string
  ) => {
    const adminData = await completeFirstAccess(email, password, name)
    setAdmin(adminData)
    setIsAuthenticated(true)
    message.success('Primeiro acesso concluído com sucesso!')
  }

  const contextValue: AuthContextData = {
    admin,
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout,
    resetPassword: handleResetPassword,
    completeFirstAccess: handleCompleteFirstAccess
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
