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
  createAd,
  updateAd,
  deleteAd,
  approveAd,
  rejectAd
} from '@/services/ads'
import { message } from 'antd'

import { IAd } from '@/types'
import { useAuth } from './AuthProvider'

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
}

const AdsContext = createContext<AdsContextData>({} as AdsContextData)

export const AdsProvider = ({ children }: { children: ReactNode }) => {
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

  const createAdHandler = async (
    adData: Omit<IAd, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (!admin?.id) return

      await createAd({ ...adData, userId: admin.id })
      message.success('Anúncio criado com sucesso!')
    } catch (error: any) {
      message.error('Erro ao criar anúncio.')
    }
  }

  const updateAdHandler = async (adId: string, adData: Partial<IAd>) => {
    try {
      await updateAd(adId, adData)
      message.success('Anúncio atualizado com sucesso!')
    } catch (error: any) {
      message.error('Erro ao atualizar anúncio.')
    }
  }

  const deleteAdHandler = async (adId: string) => {
    try {
      await deleteAd(adId)
      message.success('Anúncio excluído com sucesso!')
    } catch (error: any) {
      message.error('Erro ao excluir anúncio.')
    }
  }

  const approveAdHandler = async (adId: string) => {
    try {
      await approveAd(adId)
      message.success('Anúncio aprovado com sucesso!')
    } catch (error: any) {
      message.error('Erro ao aprovar anúncio.')
    }
  }

  const rejectAdHandler = async (adId: string, reason: string) => {
    try {
      await rejectAd(adId, reason)
      message.success('Anúncio rejeitado com sucesso!')
    } catch (error: any) {
      message.error('Erro ao rejeitar anúncio.')
    }
  }

  const contextValue: AdsContextData = {
    ads,
    loading,
    createAd: createAdHandler,
    updateAd: updateAdHandler,
    deleteAd: deleteAdHandler,
    approveAd: approveAdHandler,
    rejectAd: rejectAdHandler
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
