// src/contexts/BannersProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/firebase/config'
import { IBanner } from '@/types'
import { useAuth } from './AuthProvider'
import { App } from 'antd'
import {
  createBanner as createBannerService,
  updateBanner as updateBannerService,
  deleteBanner as deleteBannerService,
  toggleBannerStatus as toggleBannerStatusService
} from '@/services/banners'

interface BannersContextData {
  banners: IBanner[]
  loading: boolean
  createBanner: (
    bannerData: Omit<IBanner, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ) => Promise<void>
  updateBanner: (
    bannerId: string,
    bannerData: Partial<IBanner>
  ) => Promise<void>
  deleteBanner: (bannerId: string) => Promise<void>
  toggleBannerStatus: (bannerId: string, currentStatus: string) => Promise<void>
  getPerformanceData: (bannerId: string) => { date: string; clicks: number }[]
}

const BannersContext = createContext<BannersContextData>(
  {} as BannersContextData
)

export const BannersProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { admin } = useAuth()
  const [banners, setBanners] = useState<IBanner[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de banners em tempo real
  useEffect(() => {
    const bannersRef = ref(db, 'banners')
    const unsubscribe = onValue(bannersRef, (snapshot) => {
      if (snapshot.exists()) {
        const bannersData = snapshot.val()
        const bannersList = Object.entries(bannersData).map(([id, data]) => ({
          id,
          ...(data as Omit<IBanner, 'id'>)
        }))
        setBanners(bannersList)
      } else {
        setBanners([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const createBanner = async (
    bannerData: Omit<IBanner, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ) => {
    try {
      if (!admin?.id) throw new Error('Administrador não autenticado')
      await createBannerService({
        ...bannerData,
        createdBy: admin.id
      })
      message.success('Banner criado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar banner')
    }
  }

  const updateBanner = async (
    bannerId: string,
    bannerData: Partial<IBanner>
  ) => {
    try {
      await updateBannerService(bannerId, bannerData)
      message.success('Banner atualizado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao atualizar banner')
    }
  }

  const deleteBanner = async (bannerId: string) => {
    try {
      await deleteBannerService(bannerId)
      message.success('Banner excluído com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao excluir banner')
    }
  }

  const toggleBannerStatus = async (
    bannerId: string,
    currentStatus: string
  ) => {
    try {
      await toggleBannerStatusService(
        bannerId,
        currentStatus === 'active' ? 'inactive' : 'active'
      )
      message.success(
        `Banner ${
          currentStatus === 'active' ? 'desativado' : 'ativado'
        } com sucesso!`
      )
    } catch (error: any) {
      message.error(error.message || 'Erro ao alterar status do banner')
    }
  }

  // Dados fictícios para o gráfico (substituir por integração real no futuro)
  const getPerformanceData = (bannerId: string) => {
    return [
      { date: '2025-03-01', clicks: 120 },
      { date: '2025-03-02', clicks: 150 },
      { date: '2025-03-03', clicks: 90 },
      { date: '2025-03-04', clicks: 200 }
    ]
  }

  const contextValue: BannersContextData = {
    banners,
    loading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    getPerformanceData
  }

  return (
    <BannersContext.Provider value={contextValue}>
      {children}
    </BannersContext.Provider>
  )
}

export const useBanners = () => {
  const context = useContext(BannersContext)
  if (!context)
    throw new Error('useBanners must be used within a BannersProvider')
  return context
}
