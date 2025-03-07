// src/contexts/TemplateProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/firebase/config'
import {
  loginAdmin,
  logoutAdmin,
  resetPassword,
  completeFirstAccess,
  checkFirstAccess
} from '@/services/authService'
import { AdminProfile } from '@/types'

interface AuthContextData {
  admin: AdminProfile | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  completeFirstAccess: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const adminData = await checkFirstAccess(user.uid)
        if (adminData) {
          setAdmin({ ...adminData, id: user.uid })
          setIsAuthenticated(true)
        }
      } else {
        setAdmin(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const userCredential = await loginAdmin(email, password)
    const adminData = await checkFirstAccess(userCredential.user.uid)
    if (adminData) {
      setAdmin({ ...adminData, id: userCredential.user.uid })
      setIsAuthenticated(true)
    }
  }

  const logout = async () => {
    await logoutAdmin()
    setAdmin(null)
    setIsAuthenticated(false)
  }

  const handleResetPassword = async (email: string) => {
    await resetPassword(email)
  }

  const handleCompleteFirstAccess = async (
    email: string,
    password: string,
    name: string
  ) => {
    await completeFirstAccess(email, password, name)
    const adminData = await checkFirstAccess(auth.currentUser!.uid)
    if (adminData) {
      setAdmin({ ...adminData, id: auth.currentUser!.uid })
      setIsAuthenticated(true)
    }
  }

  const contextValue: AuthContextData = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
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
