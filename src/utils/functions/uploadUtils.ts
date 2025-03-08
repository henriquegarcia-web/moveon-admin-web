// src/utils/uploadUtils.ts
import { message } from 'antd'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { GetProp, UploadProps } from 'antd'

import { storage } from '@/firebase/config'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const beforeUploadImage = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('Apenas arquivos JPG/PNG são permitidos!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('A imagem deve ser menor que 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const beforeUploadVideo = (file: FileType) => {
  const isMp4 = file.type === 'video/mp4'
  if (!isMp4) {
    message.error('Apenas arquivos MP4 são permitidos!')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('O vídeo deve ser menor que 10MB!')
  }
  return isMp4 && isLt10M
}

export const uploadFileToFirebase = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
