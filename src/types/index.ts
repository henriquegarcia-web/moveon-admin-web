// src/types/index.ts

import { ADS_STATUS_TYPES, PRODUCT_CONDITION_TYPES } from '@/data/admin'

// ============================================= ADMIN TYPES

export interface IAdminProfile {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt?: string
  firstAccessPending: boolean
  isBlocked?: boolean
}

// ============================================= USER TYPES

export interface IUserProfile {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  birthDate: string
  address: {
    zipcode: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    complement?: string
  }
  profilePicture?: string
  trustLevel: number
  isVerified: boolean
  socialMedia?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
  createdAt: string
  updatedAt?: string
  interests?: InterestCenter
  settings?: UserSettings
  isBlocked?: boolean
}

export interface InterestCenter {
  sports: Sport[]
  tournaments: Tournament[]
  description?: string
  trophies: Trophy[]
  favoriteCategories: string[]
  privacy: {
    sports: 'public' | 'friends' | 'private'
    tournaments: 'public' | 'friends' | 'private'
    description: 'public' | 'friends' | 'private'
    trophies: 'public' | 'friends' | 'private'
    favoriteCategories: 'public' | 'friends' | 'private'
  }
}

export interface Sport {
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface Tournament {
  name: string
  date: string
  location?: string
  result?: string
}

export interface Trophy {
  imageUrl: string
  title: string
  date: string
}

export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  language: string
  theme: 'light' | 'dark' | 'system'
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    activityVisibility: 'public' | 'friends' | 'private'
  }
  blockedUsers: string[]
}

// ============================================= ADS TYPES

export type AdStatusType = (typeof ADS_STATUS_TYPES)[number]['key']

export type ProductConditionType =
  (typeof PRODUCT_CONDITION_TYPES)[number]['key']

export interface IAd {
  id: string
  userId: string
  title: string
  description: string
  price: number
  categoryId: string
  condition: ProductConditionType
  location: {
    cep: string
    address?: string
  }
  photos?: string[]
  video?: string
  status: AdStatusType
  phone: string
  createdAt: string
  updatedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

// ============================================= BANNER TYPES

export interface IBanner {
  id: string
  title: string
  desktopImageUrl: string
  mobileImageUrl: string
  position: 'home-top' | 'home-middle' | 'search-side' | 'other'
  link?: string
  status: 'active' | 'inactive' | 'scheduled'
  startDate: string
  endDate?: string
  priority: number
  createdAt: string
  updatedAt?: string
  createdBy: string
}
