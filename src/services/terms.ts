import { ref, set, get } from 'firebase/database'
import { db } from '@/firebase/config'

export interface ITermDocument {
  id: string
  title: string
  content: string
  updatedAt: string
}

const defaultDocuments: { id: string; title: string; content: string }[] = [
  {
    id: 'terms-of-use',
    title: 'Termos de Uso',
    content: '<p>Insira os Termos de Uso aqui...</p>'
  },
  {
    id: 'privacy-policy',
    title: 'Política de Privacidade',
    content: '<p>Insira a Política de Privacidade aqui...</p>'
  },
  {
    id: 'cookies-policy',
    title: 'Política de Cookies',
    content: '<p>Insira a Política de Cookies aqui...</p>'
  },
  {
    id: 'community-guidelines',
    title: 'Diretrizes da Comunidade',
    content: '<p>Insira as Diretrizes da Comunidade aqui...</p>'
  },
  {
    id: 'refund-policy',
    title: 'Política de Reembolso',
    content: '<p>Insira a Política de Reembolso aqui...</p>'
  },
  {
    id: 'advertiser-agreement',
    title: 'Acordo de Anunciante',
    content: '<p>Insira o Acordo de Anunciante aqui...</p>'
  },
  {
    id: 'content-policy',
    title: 'Política de Conteúdo',
    content: '<p>Insira a Política de Conteúdo aqui...</p>'
  }
]

// Inicializa os documentos padrão no Firebase, se não existirem
export const initializeTerms = async () => {
  const termsRef = ref(db, 'terms')
  const snapshot = await get(termsRef)
  if (!snapshot.exists()) {
    const initialData: Record<string, Omit<ITermDocument, 'id'>> = {}
    defaultDocuments.forEach((doc) => {
      initialData[doc.id] = {
        title: doc.title,
        content: doc.content,
        updatedAt: new Date().toISOString()
      }
    })
    await set(termsRef, initialData)
  }
}

// Atualiza um documento
export const updateTermDocument = async (termId: string, content: string) => {
  const termRef = ref(db, `terms/${termId}`)
  await set(termRef, {
    title: defaultDocuments.find((doc) => doc.id === termId)?.title,
    content,
    updatedAt: new Date().toISOString()
  })
}
