// src/contexts/AdsProvider.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/firebase/config'
import {
  createAd as createAdService,
  updateAd as updateAdService,
  deleteAd as deleteAdService,
  approveAd as approveAdService,
  rejectAd as rejectAdService
} from '@/services/ads'
import { App } from 'antd'
import { IAd } from '@/types'
import { useAuth } from './AuthProvider'
import {
  SPORT_CATEGORIES_V1,
  ADS_STATUS_TYPES,
  PRODUCT_CONDITION_TYPES
} from '@/data/admin'

interface AdsContextData {
  ads: IAd[]
  loading: boolean
  createAd: (
    adData: Omit<IAd, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
  updateAd: (adId: string, adData: Partial<IAd>) => Promise<void>
  deleteAd: (adId: string) => Promise<void>
  approveAd: (adId: string) => Promise<void>
  rejectAd: (adId: string, reason: string) => Promise<void>
  formatCep: (cep: string) => string
  formatPhone: (phone: string) => string
  formatPrice: (price: number) => string
  getCategoryLabel: (categoryId: string) => string
  getConditionLabel: (condition: string) => string
  getStatusLabel: (status: string) => string
}

const AdsContext = createContext<AdsContextData>({} as AdsContextData)

export const AdsProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { admin } = useAuth()

  const [ads, setAds] = useState<IAd[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de anúncios
  useEffect(() => {
    const adsRef = ref(db, 'ads')
    const unsubscribe = onValue(adsRef, (snapshot) => {
      if (snapshot.exists()) {
        const adsData = snapshot.val()
        const adsList = Object.entries(adsData).map(([id, data]) => ({
          id,
          ...(data as Omit<IAd, 'id'>)
        }))
        setAds(adsList)
      } else {
        setAds([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Funções de formatação centralizadas
  const formatCep = (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length <= 5) return cleaned
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7,
      11
    )}`
  }

  const formatPrice = (value: number | undefined) => {
    if (value === undefined || value === null) return ''
    const cleaned = value.toString().replace(/\D/g, '')
    const numberValue = parseFloat(cleaned) / 100
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const getCategoryLabel = (categoryId: string): string => {
    for (const category of SPORT_CATEGORIES_V1) {
      if (category.id === categoryId) return category.name
      const subcategory = category.subcategories.find(
        (sub) => sub.id === categoryId
      )
      if (subcategory) return subcategory.name
    }
    return categoryId
  }

  const getConditionLabel = (condition: string): string => {
    const cond = PRODUCT_CONDITION_TYPES.find((c) => c.key === condition)
    return cond ? cond.label : condition
  }

  const getStatusLabel = (status: string): string => {
    const statusObj = ADS_STATUS_TYPES.find((s) => s.key === status)
    return statusObj ? statusObj.label : status
  }

  const createAdHandler = async (
    adData: Omit<IAd, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (!admin?.id) {
        message.error('Usuário administrador não autenticado.')
        return
      }
      const cleanedData = {
        ...adData,
        location: {
          ...adData.location,
          cep: adData.location.cep.replace(/\D/g, '')
        },
        phone: adData.phone.replace(/\D/g, '')
      }
      await createAdService({ ...cleanedData, userId: admin.id })
      message.success('Anúncio criado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar anúncio.')
    }
  }

  const updateAdHandler = async (adId: string, adData: Partial<IAd>) => {
    try {
      const cleanedData = {
        ...adData,
        location: adData.location
          ? {
              ...adData.location,
              cep: adData.location.cep?.replace(/\D/g, '')
            }
          : undefined,
        phone: adData.phone?.replace(/\D/g, '')
      }
      await updateAdService(adId, cleanedData)
      message.success('Anúncio atualizado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao atualizar anúncio.')
    }
  }

  const deleteAdHandler = async (adId: string) => {
    try {
      await deleteAdService(adId)
      message.success('Anúncio excluído com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao excluir anúncio.')
    }
  }

  const approveAdHandler = async (adId: string) => {
    try {
      await approveAdService(adId)
      message.success('Anúncio aprovado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao aprovar anúncio.')
    }
  }

  const rejectAdHandler = async (adId: string, reason: string) => {
    try {
      await rejectAdService(adId, reason)
      message.success('Anúncio rejeitado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao rejeitar anúncio.')
    }
  }

  const contextValue: AdsContextData = {
    ads,
    loading,
    createAd: createAdHandler,
    updateAd: updateAdHandler,
    deleteAd: deleteAdHandler,
    approveAd: approveAdHandler,
    rejectAd: rejectAdHandler,
    formatCep,
    formatPhone,
    formatPrice,
    getCategoryLabel,
    getConditionLabel,
    getStatusLabel
  }

  return (
    <AdsContext.Provider value={contextValue}>{children}</AdsContext.Provider>
  )
}

export const useAds = () => {
  const context = useContext(AdsContext)
  if (!context) throw new Error('useAds must be used within an AdsProvider')
  return context
}
