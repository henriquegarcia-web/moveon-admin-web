// src/services/users.ts
import { ref, update, get } from 'firebase/database'
import { db } from '@/firebase/config'
import { IUserProfile } from '@/types'

export const blockUser = async (
  userId: string,
  block: boolean
): Promise<void> => {
  const userRef = ref(db, `users/${userId}`)
  const snapshot = await get(userRef)
  if (!snapshot.exists()) {
    throw new Error('Usuário não encontrado.')
  }
  await update(userRef, {
    isBlocked: block,
    updatedAt: new Date().toISOString()
  })
}

export const getUserById = async (
  userId: string
): Promise<IUserProfile | null> => {
  const userRef = ref(db, `users/${userId}`)
  const snapshot = await get(userRef)
  return snapshot.exists() ? { id: userId, ...snapshot.val() } : null
}
