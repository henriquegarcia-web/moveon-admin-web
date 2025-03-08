// src/services/ads.ts
import { ref, set, update, remove, get, onValue } from 'firebase/database'
import { db } from '@/firebase/config'
import { IAd } from '@/types'

export const createAd = async (
  adData: Omit<IAd, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  const adId = Date.now().toString()
  const adRef = ref(db, `ads/${adId}`)
  await set(adRef, {
    id: adId,
    ...adData,
    createdAt: new Date().toISOString()
  })
}

export const updateAd = async (
  adId: string,
  adData: Partial<IAd>
): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  await update(adRef, { ...adData, updatedAt: new Date().toISOString() })
}

export const deleteAd = async (adId: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  await remove(adRef)
}

export const approveAd = async (adId: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  await update(adRef, {
    status: 'published',
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const rejectAd = async (adId: string, reason: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  await update(adRef, {
    status: 'rejected',
    rejectionReason: reason,
    rejectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const getAdById = async (adId: string): Promise<IAd | null> => {
  const adRef = ref(db, `ads/${adId}`)
  const snapshot = await get(adRef)
  return snapshot.exists() ? { id: adId, ...snapshot.val() } : null
}
