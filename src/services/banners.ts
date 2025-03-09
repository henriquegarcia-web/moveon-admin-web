import { db } from '@/firebase/config'
import { ref, set, update, remove } from 'firebase/database'
import { IBanner } from '@/types'

export const createBanner = async (
  bannerData: Omit<IBanner, 'id' | 'createdAt'>
) => {
  const bannerId = Date.now().toString()
  const bannerRef = ref(db, `banners/${bannerId}`)
  await set(bannerRef, {
    ...bannerData,
    id: bannerId,
    createdAt: new Date().toISOString()
  }).catch(() => {
    throw new Error('Erro ao criar banner no Firebase')
  })
}

export const updateBanner = async (
  bannerId: string,
  bannerData: Partial<IBanner>
) => {
  const bannerRef = ref(db, `banners/${bannerId}`)
  await update(bannerRef, {
    ...bannerData,
    updatedAt: new Date().toISOString()
  }).catch(() => {
    throw new Error('Erro ao atualizar banner no Firebase')
  })
}

export const deleteBanner = async (bannerId: string) => {
  const bannerRef = ref(db, `banners/${bannerId}`)
  await remove(bannerRef).catch(() => {
    throw new Error('Erro ao excluir banner no Firebase')
  })
}

export const toggleBannerStatus = async (
  bannerId: string,
  newStatus: 'active' | 'inactive'
) => {
  const bannerRef = ref(db, `banners/${bannerId}`)
  await update(bannerRef, {
    status: newStatus,
    updatedAt: new Date().toISOString()
  }).catch(() => {
    throw new Error('Erro ao alterar status do banner no Firebase')
  })
}
