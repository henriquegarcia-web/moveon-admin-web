import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { ref, onValue, remove } from 'firebase/database'
import { db } from '@/firebase/config'
import { IAdminProfile, ITermDocument } from '@/types'
import { createAdminAccess, blockAdminAccess } from '@/services/auth'
import { updateTermDocument } from '@/services/terms'
import { App } from 'antd'
import { useAuth } from '@/contexts/AuthProvider'

interface SettingsContextData {
  admins: IAdminProfile[]
  terms: ITermDocument[]
  loading: boolean
  createAccess: (email: string) => Promise<void>
  deleteAccess: (adminId: string) => Promise<void>
  toggleBlockAccess: (adminId: string, block: boolean) => Promise<void>
  updateTerm: (termId: string, content: string) => Promise<void>
}

const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData
)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { admin: currentAdmin } = useAuth()

  const [admins, setAdmins] = useState<IAdminProfile[]>([])
  const [terms, setTerms] = useState<ITermDocument[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de administradores
  useEffect(() => {
    const adminsRef = ref(db, 'admins')
    const unsubscribeAdmins = onValue(adminsRef, (snapshot) => {
      if (snapshot.exists()) {
        const adminsData = snapshot.val()
        const adminsList = Object.entries(adminsData).map(([id, data]) => ({
          id,
          ...(data as Omit<IAdminProfile, 'id'>)
        }))
        setAdmins(adminsList)
      } else {
        setAdmins([])
      }
      setLoading(false)
    })

    // Listagem de termos
    const termsRef = ref(db, 'terms')
    const unsubscribeTerms = onValue(termsRef, (snapshot) => {
      if (snapshot.exists()) {
        const termsData = snapshot.val()
        const termsList = Object.entries(termsData).map(([id, data]) => ({
          id,
          ...(data as Omit<ITermDocument, 'id'>)
        }))
        setTerms(termsList)
      } else {
        setTerms([])
      }
    })

    return () => {
      unsubscribeAdmins()
      unsubscribeTerms()
    }
  }, [])

  // Criar novo acesso
  const createAccess = async (email: string) => {
    try {
      await createAdminAccess(email)
      message.success(
        'Acesso criado com sucesso! Um e-mail será enviado ao usuário.'
      )
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar acesso.')
    }
  }

  // Deletar acesso
  const deleteAccess = async (adminId: string) => {
    if (adminId === currentAdmin?.id) {
      message.error('Você não pode excluir seu próprio acesso.')
      return
    }
    try {
      const adminRef = ref(db, `admins/${adminId}`)
      await remove(adminRef)
      message.success('Acesso removido com sucesso!')
    } catch (error: any) {
      message.error('Erro ao remover acesso.')
    }
  }

  // Bloquear/Desbloquear acesso
  const toggleBlockAccess = async (adminId: string, block: boolean) => {
    if (adminId === currentAdmin?.id) {
      message.error('Você não pode bloquear seu próprio acesso.')
      return
    }
    try {
      await blockAdminAccess(adminId, block)
      message.success(
        `Acesso ${block ? 'bloqueado' : 'desbloqueado'} com sucesso!`
      )
    } catch (error: any) {
      message.error('Erro ao alterar status de acesso.')
    }
  }

  // Atualizar um documento de termos
  const updateTerm = async (termId: string, content: string) => {
    try {
      await updateTermDocument(termId, content)
      message.success('Documento atualizado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao atualizar documento.')
    }
  }

  const contextValue: SettingsContextData = {
    admins,
    terms,
    loading,
    createAccess,
    deleteAccess,
    toggleBlockAccess,
    updateTerm
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context)
    throw new Error('useSettings must be used within a SettingsProvider')
  return context
}
