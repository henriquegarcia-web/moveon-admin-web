import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  UserCredential
} from 'firebase/auth'
import { ref, set, get, child } from 'firebase/database'
import { auth, db } from '@/firebase/config'
import { AdminProfile } from '@/types'

// Função de login
export const loginAdmin = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password)
}

// Função de primeiro acesso (atualiza senha e dados do admin)
export const completeFirstAccess = async (
  email: string,
  password: string,
  name: string
): Promise<void> => {
  const user = auth.currentUser
  if (!user) throw new Error('Nenhum usuário autenticado')

  // Atualiza a senha
  await updatePassword(user, password)

  // Salva os dados adicionais no Realtime Database em "admins/{uid}"
  const adminRef = ref(db, `admins/${user.uid}`)
  await set(adminRef, {
    email,
    name,
    createdAt: new Date().toISOString(),
    firstAccessPending: false,
    updatedAt: new Date().toISOString()
  })
}

// Função para verificar se é primeiro acesso
export const checkFirstAccess = async (
  uid: string
): Promise<AdminProfile | null> => {
  const adminRef = ref(db, `admins/${uid}`)
  const snapshot = await get(adminRef)
  return snapshot.exists() ? { id: uid, ...snapshot.val() } : null
}

// Função de logout
export const logoutAdmin = async (): Promise<void> => {
  await signOut(auth)
}

// Função de recuperação de senha
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email)
}

// Função para criar acesso (será implementada depois)
export const createAdminAccess = async (email: string): Promise<void> => {
  // Lógica a ser implementada por outro admin
  console.log(`Criação de acesso para ${email} - A ser implementado`)
}
