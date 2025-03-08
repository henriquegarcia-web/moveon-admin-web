// src/types/index.ts

export interface IAdminProfile {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt?: string
  firstAccessPending: boolean
  isBlocked?: boolean
}

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
