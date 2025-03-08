// src/types/index.ts

export interface IAdminProfile {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt?: string
  firstAccessPending: boolean
  isBlocked?: boolean;
}
