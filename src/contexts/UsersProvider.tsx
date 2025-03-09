// src/contexts/UsersProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { ref, onValue } from 'firebase/database'
import { App } from 'antd'

import { db } from '@/firebase/config'
import { IUserProfile } from '@/types'
import { blockUser } from '@/services/users'

interface UsersContextData {
  users: IUserProfile[]
  loading: boolean
  toggleBlockUser: (userId: string, block: boolean) => Promise<void>
}

const UsersContext = createContext<UsersContextData>({} as UsersContextData)

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()

  const [users, setUsers] = useState<IUserProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de usuários
  useEffect(() => {
    const usersRef = ref(db, 'users')
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val()
        const usersList = Object.entries(usersData).map(([id, data]) => ({
          id,
          ...(data as Omit<IUserProfile, 'id'>)
        }))
        setUsers(usersList)
      } else {
        setUsers([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Bloquear/Desbloquear usuário
  const toggleBlockUser = async (userId: string, block: boolean) => {
    try {
      await blockUser(userId, block)
      message.success(
        `Usuário ${block ? 'bloqueado' : 'desbloqueado'} com sucesso!`
      )
    } catch (error: any) {
      message.error('Erro ao alterar status do usuário.')
    }
  }

  const contextValue: UsersContextData = {
    users,
    loading,
    toggleBlockUser
  }

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) throw new Error('useUsers must be used within a UsersProvider')
  return context
}
