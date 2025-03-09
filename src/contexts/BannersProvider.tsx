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
import {
  createBanner as createBannerService,
  updateBanner as updateBannerService,
  deleteBanner as deleteBannerService
} from '@/services/banners'
import { App } from 'antd'
import { IBanner } from '@/types'
import { useAuth } from './AuthProvider'
import {
  BANNER_STATUS_TYPES,
  BANNER_POSITION_TYPES,
  BannerStatus,
  BannerPosition
} from '@/data/admin'

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
  toggleBannerStatus: (
    bannerId: string,
    currentStatus: IBanner['status']
  ) => Promise<void>
  getPerformanceData: (bannerId: string) => { date: string; clicks: number }[]
  getBannerStatusDetail: (status: string) => BannerStatus | null
  getBannerPositionDetail: (position: string) => BannerPosition | null
}

const BannersContext = createContext<BannersContextData>(
  {} as BannersContextData
)

export const BannersProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { admin } = useAuth()

  const [banners, setBanners] = useState<IBanner[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de banners
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

  const getBannerStatusDetail = (status: string): BannerStatus | null => {
    const statusObj = BANNER_STATUS_TYPES.find((s) => s.key === status)
    return statusObj || null
  }

  const getBannerPositionDetail = (position: string): BannerPosition | null => {
    const positionObj = BANNER_POSITION_TYPES.find((p) => p.key === position)
    return positionObj || null
  }

  const createBanner = async (
    bannerData: Omit<IBanner, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ) => {
    try {
      if (!admin?.id) {
        message.error('Usuário administrador não autenticado.')
        return
      }
      await createBannerService({ ...bannerData, createdBy: admin.id })
      message.success('Banner criado com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar banner.')
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
      message.error(error.message || 'Erro ao atualizar banner.')
    }
  }

  const deleteBanner = async (bannerId: string) => {
    try {
      await deleteBannerService(bannerId)
      message.success('Banner excluído com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao excluir banner.')
    }
  }

  const toggleBannerStatus = async (
    bannerId: string,
    currentStatus: IBanner['status']
  ) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateBannerService(bannerId, { status: newStatus })
      message.success(
        `Banner ${
          newStatus === 'active' ? 'ativado' : 'desativado'
        } com sucesso!`
      )
    } catch (error: any) {
      message.error(error.message || 'Erro ao alterar status do banner.')
    }
  }

  const getPerformanceData = (
    bannerId: string
  ): { date: string; clicks: number }[] => {
    return [
      { date: '2023-10-01', clicks: 120 },
      { date: '2023-10-02', clicks: 150 },
      { date: '2023-10-03', clicks: 80 },
      { date: '2023-10-04', clicks: 200 }
    ]
  }

  const contextValue: BannersContextData = {
    banners,
    loading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    getPerformanceData,
    getBannerStatusDetail,
    getBannerPositionDetail
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
