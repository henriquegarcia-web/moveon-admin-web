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
  createAdvertisingCampaign as createAdvertisingCampaignService,
  updateAdvertisingCampaign as updateAdvertisingCampaignService,
  deleteAdvertisingCampaign as deleteAdvertisingCampaignService,
  getCampaignMetrics as getCampaignMetricsService
} from '@/services/advertising'
import { App } from 'antd'
import { IAdvertisingCampaign } from '@/types'
import { useAuth } from './AuthProvider'
import {
  ADVERTISING_STATUS_TYPES,
  ADVERTISING_TYPE_TYPES,
  AdvertisingStatus,
  AdvertisingType
} from '@/data/admin'

interface AdvertisingContextData {
  campaigns: IAdvertisingCampaign[]
  loading: boolean
  createCampaign: (
    campaignData: Omit<
      IAdvertisingCampaign,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'impressions' | 'clicks'
    >
  ) => Promise<void>
  updateCampaign: (
    campaignId: string,
    campaignData: Partial<IAdvertisingCampaign>
  ) => Promise<void>
  deleteCampaign: (campaignId: string) => Promise<void>
  toggleCampaignStatus: (
    campaignId: string,
    currentStatus: IAdvertisingCampaign['status']
  ) => Promise<void>
  getCampaignMetrics: (
    campaignId: string
  ) => Promise<{ date: string; impressions: number; clicks: number }[]>
  getFormattedCampaignMetrics: (campaignId: string) => Promise<any>
  getAdvertisingStatusDetail: (status: string) => AdvertisingStatus | null
  getAdvertisingTypeDetail: (type: string) => AdvertisingType | null
}

const AdvertisingContext = createContext<AdvertisingContextData>(
  {} as AdvertisingContextData
)

export const AdvertisingProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { admin } = useAuth()

  const [campaigns, setCampaigns] = useState<IAdvertisingCampaign[]>([])
  const [loading, setLoading] = useState(true)

  // Listagem de campanhas
  useEffect(() => {
    const campaignsRef = ref(db, 'advertising')
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      if (snapshot.exists()) {
        const campaignsData = snapshot.val()
        const campaignsList = Object.entries(campaignsData).map(
          ([id, data]) => ({
            id,
            ...(data as Omit<IAdvertisingCampaign, 'id'>)
          })
        )
        setCampaigns(campaignsList)
      } else {
        setCampaigns([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getAdvertisingStatusDetail = (
    status: string
  ): AdvertisingStatus | null => {
    const statusObj = ADVERTISING_STATUS_TYPES.find((s) => s.key === status)
    return statusObj || null
  }

  const getAdvertisingTypeDetail = (type: string): AdvertisingType | null => {
    const typeObj = ADVERTISING_TYPE_TYPES.find((t) => t.key === type)
    return typeObj || null
  }

  const createCampaign = async (
    campaignData: Omit<
      IAdvertisingCampaign,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'impressions' | 'clicks'
    >
  ) => {
    try {
      if (!admin?.id) {
        message.error('Usuário administrador não autenticado.')
        return
      }
      await createAdvertisingCampaignService({
        ...campaignData,
        createdBy: admin.id
      })
      message.success('Campanha criada com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar campanha.')
    }
  }

  const updateCampaign = async (
    campaignId: string,
    campaignData: Partial<IAdvertisingCampaign>
  ) => {
    try {
      await updateAdvertisingCampaignService(campaignId, campaignData)
      message.success('Campanha atualizada com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao atualizar campanha.')
    }
  }

  const deleteCampaign = async (campaignId: string) => {
    try {
      await deleteAdvertisingCampaignService(campaignId)
      message.success('Campanha excluída com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao excluir campanha.')
    }
  }

  const toggleCampaignStatus = async (
    campaignId: string,
    currentStatus: IAdvertisingCampaign['status']
  ) => {
    try {
      let newStatus: IAdvertisingCampaign['status']
      if (currentStatus === 'active') {
        newStatus = 'paused'
      } else if (currentStatus === 'paused') {
        newStatus = 'active'
      } else {
        throw new Error(
          'Apenas campanhas ativas ou pausadas podem ser alternadas.'
        )
      }
      await updateAdvertisingCampaignService(campaignId, { status: newStatus })
      message.success(
        `Campanha ${
          newStatus === 'active' ? 'retomada' : 'pausada'
        } com sucesso!`
      )
    } catch (error: any) {
      message.error(error.message || 'Erro ao alterar status da campanha.')
    }
  }

  const getCampaignMetrics = async (
    campaignId: string
  ): Promise<{ date: string; impressions: number; clicks: number }[]> => {
    const metrics = await getCampaignMetricsService(campaignId)
    return metrics.dailyData || []
  }

  // Função que encapsula toda a lógica de formatação
  const getFormattedCampaignMetrics = async (campaignId: string) => {
    if (!campaignId) return []

    try {
      const rawMetrics = await getCampaignMetrics(campaignId)
      const formattedData = rawMetrics
        .map((item) => [
          { date: item.date, value: item.impressions, type: 'impressions' },
          { date: item.date, value: item.clicks, type: 'clicks' }
        ])
        .flat()
      return formattedData
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      return []
    }
  }

  const contextValue: AdvertisingContextData = {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
    getCampaignMetrics,
    getFormattedCampaignMetrics,
    getAdvertisingStatusDetail,
    getAdvertisingTypeDetail
  }

  return (
    <AdvertisingContext.Provider value={contextValue}>
      {children}
    </AdvertisingContext.Provider>
  )
}

export const useAdvertising = () => {
  const context = useContext(AdvertisingContext)
  if (!context)
    throw new Error('useAdvertising must be used within an AdvertisingProvider')
  return context
}
