// src/services/auth.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential
} from 'firebase/auth'
import { ref, set, get, remove } from 'firebase/database'
import { auth, db } from '@/firebase/config'
import { IAdminProfile } from '@/types'

export const loginAdmin = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const checkAdminStatus = async (
  uid: string
): Promise<IAdminProfile | null> => {
  const adminRef = ref(db, `admins/${uid}`)
  const snapshot = await get(adminRef)
  return snapshot.exists() ? { id: uid, ...snapshot.val() } : null
}

export const getAdminByEmail = async (
  email: string
): Promise<IAdminProfile | null> => {
  const adminsRef = ref(db, 'admins')
  const snapshot = await get(adminsRef)
  if (snapshot.exists()) {
    const admins = snapshot.val()
    const adminEntry = Object.entries(admins).find(
      ([, admin]: [string, any]) => admin.email === email
    )
    if (adminEntry) {
      const [id, adminData] = adminEntry
      return { id, ...(adminData as object) } as IAdminProfile
    }
  }
  return null
}

export const completeFirstAccess = async (
  email: string,
  password: string,
  name: string
): Promise<IAdminProfile> => {
  const existingAdmin = await getAdminByEmail(email)
  if (!existingAdmin || !existingAdmin.firstAccessPending) {
    throw new Error(
      'Nenhum primeiro acesso pendente encontrado para este e-mail.'
    )
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  await remove(ref(db, `admins/${existingAdmin.id}`))

  const adminRef = ref(db, `admins/${userCredential.user.uid}`)
  const adminData: IAdminProfile = {
    id: userCredential.user.uid,
    email,
    name,
    createdAt: existingAdmin.createdAt,
    updatedAt: new Date().toISOString(),
    firstAccessPending: false
  }
  await set(adminRef, adminData)

  return adminData
}

export const logoutAdmin = async (): Promise<void> => {
  await signOut(auth)
}

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email)
}

export const createAdminAccess = async (email: string): Promise<void> => {
  const tempId = `pending_${Date.now()}`
  const adminRef = ref(db, `admins/${tempId}`)
  const existingAdmin = await getAdminByEmail(email)

  if (existingAdmin) {
    throw new Error('E-mail já registrado.')
  }

  await set(adminRef, {
    id: tempId,
    email,
    createdAt: new Date().toISOString(),
    firstAccessPending: true
  })
}
