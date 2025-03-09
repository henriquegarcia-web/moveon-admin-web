// src/services/ads.ts

import { ref, set, update, remove, get } from 'firebase/database'
import { db } from '@/firebase/config'
import { IAd } from '@/types'

// Interface para erros personalizados
interface AdServiceError extends Error {
  code: string
  message: string
}

export const createAd = async (
  adData: Omit<IAd, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  const adId = Date.now().toString()
  const adRef = ref(db, `ads/${adId}`)

  if (!adData.userId)
    throw {
      code: 'MISSING_USER_ID',
      message: 'ID do usuário é obrigatório.'
    } as AdServiceError
  if (!adData.title || adData.title.length > 70)
    throw {
      code: 'INVALID_TITLE',
      message: 'Título inválido ou muito longo.'
    } as AdServiceError
  if (!adData.description || adData.description.length < 10)
    throw {
      code: 'INVALID_DESCRIPTION',
      message: 'Descrição inválida ou muito curta.'
    } as AdServiceError
  if (!adData.price || adData.price <= 0)
    throw {
      code: 'INVALID_PRICE',
      message: 'Preço deve ser maior que 0.'
    } as AdServiceError
  if (!adData.categoryId)
    throw {
      code: 'INVALID_CATEGORY',
      message: 'Categoria é obrigatória.'
    } as AdServiceError
  if (!adData.condition)
    throw {
      code: 'INVALID_CONDITION',
      message: 'Condição é obrigatória.'
    } as AdServiceError
  if (!adData.location?.cep || !/^\d{8}$/.test(adData.location.cep))
    throw { code: 'INVALID_CEP', message: 'CEP inválido.' } as AdServiceError
  if (!adData.phone || !/^\d{11}$/.test(adData.phone))
    throw {
      code: 'INVALID_PHONE',
      message: 'Telefone inválido.'
    } as AdServiceError
  if (!adData.status)
    throw {
      code: 'INVALID_STATUS',
      message: 'Status é obrigatório.'
    } as AdServiceError

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
  if (!adId)
    throw {
      code: 'MISSING_AD_ID',
      message: 'ID do anúncio é obrigatório.'
    } as AdServiceError

  await update(adRef, { ...adData, updatedAt: new Date().toISOString() })
}

export const deleteAd = async (adId: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  if (!adId)
    throw {
      code: 'MISSING_AD_ID',
      message: 'ID do anúncio é obrigatório.'
    } as AdServiceError

  await remove(adRef)
}

export const approveAd = async (adId: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  if (!adId)
    throw {
      code: 'MISSING_AD_ID',
      message: 'ID do anúncio é obrigatório.'
    } as AdServiceError

  await update(adRef, {
    status: 'published',
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const rejectAd = async (adId: string, reason: string): Promise<void> => {
  const adRef = ref(db, `ads/${adId}`)
  if (!adId)
    throw {
      code: 'MISSING_AD_ID',
      message: 'ID do anúncio é obrigatório.'
    } as AdServiceError
  if (!reason)
    throw {
      code: 'MISSING_REASON',
      message: 'Motivo da rejeição é obrigatório.'
    } as AdServiceError

  await update(adRef, {
    status: 'rejected',
    rejectionReason: reason,
    rejectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const getAdById = async (adId: string): Promise<IAd | null> => {
  const adRef = ref(db, `ads/${adId}`)
  if (!adId)
    throw {
      code: 'MISSING_AD_ID',
      message: 'ID do anúncio é obrigatório.'
    } as AdServiceError

  const snapshot = await get(adRef)
  return snapshot.exists() ? { id: adId, ...snapshot.val() } : null
}
