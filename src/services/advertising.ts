import { db } from '@/firebase/config'
import { ref, set, get, update, remove, onValue } from 'firebase/database'
import { IAdvertisingCampaign } from '@/types'

export const createAdvertisingCampaign = async (
  campaignData: Omit<
    IAdvertisingCampaign,
    'id' | 'createdAt' | 'updatedAt' | 'impressions' | 'clicks'
  >
) => {
  const campaignId = `campaign-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`
  const createdAt = new Date().toISOString()
  const campaignRef = ref(db, `advertising/${campaignId}`)

  const campaign: IAdvertisingCampaign = {
    ...campaignData,
    id: campaignId,
    createdAt,
    updatedAt: createdAt,
    impressions: 0,
    clicks: 0
  }

  await set(campaignRef, campaign)
  return campaignId
}

export const updateAdvertisingCampaign = async (
  campaignId: string,
  campaignData: Partial<IAdvertisingCampaign>
) => {
  const campaignRef = ref(db, `advertising/${campaignId}`)
  const updatedAt = new Date().toISOString()
  await update(campaignRef, { ...campaignData, updatedAt })
}

export const deleteAdvertisingCampaign = async (campaignId: string) => {
  const campaignRef = ref(db, `advertising/${campaignId}`)
  await remove(campaignRef)
}

export const getCampaignMetrics = async (
  campaignId: string
): Promise<{
  impressions: number
  clicks: number
  dailyData: {
    date: string
    impressions: number
    clicks: number
  }[]
}> => {
  return {
    impressions: 1000,
    clicks: 50,
    dailyData: [
      { date: '2023-10-01', impressions: 200, clicks: 10 },
      { date: '2023-10-02', impressions: 300, clicks: 15 },
      { date: '2023-10-03', impressions: 250, clicks: 12 },
      { date: '2023-10-04', impressions: 250, clicks: 13 }
    ]
  }
}
