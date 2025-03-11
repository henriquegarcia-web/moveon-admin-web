import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/firebase/config'
import { App } from 'antd'
import moment from 'moment'
import { IUserProfile, IAd, ReportsData } from '@/types'

interface ReportsContextData {
  reportsData: ReportsData
  loading: boolean
}

const ReportsContext = createContext<ReportsContextData>(
  {} as ReportsContextData
)

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const [users, setUsers] = useState<IUserProfile[]>([])
  const [ads, setAds] = useState<IAd[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usersRef = ref(db, 'users')
    const adsRef = ref(db, 'ads')

    // Carregar usuários
    const unsubscribeUsers = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val()
          const usersList = Object.entries(usersData)?.map(([id, data]) => ({
            id,
            ...(data as Omit<IUserProfile, 'id'>)
          }))
          setUsers(usersList)
        } else {
          setUsers([])
        }
      },
      (error) => {
        message.error('Erro ao carregar dados de usuários: ' + error.message)
      }
    )

    // Carregar anúncios
    const unsubscribeAds = onValue(
      adsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const adsData = snapshot.val()
          const adsList = Object.entries(adsData)?.map(([id, data]) => ({
            id,
            ...(data as Omit<IAd, 'id'>)
          }))
          setAds(adsList)
        } else {
          setAds([])
        }
        setLoading(false)
      },
      (error) => {
        message.error('Erro ao carregar dados de anúncios: ' + error.message)
        setLoading(false)
      }
    )

    return () => {
      unsubscribeUsers()
      unsubscribeAds()
    }
  }, [message])

  const reportsData: ReportsData = {
    // Dados de usuários
    users,
    totalUsers: users.length,
    verifiedUsersPercentage: (() => {
      const verified = users.filter((user) => user.isVerified).length
      return users.length > 0 ? (verified / users.length) * 100 : 0
    })(),
    trustLevelAverage: (() => {
      const totalTrust = users.reduce((sum, user) => sum + user.trustLevel, 0)
      return users.length > 0 ? totalTrust / users.length : 0
    })(),
    sportPopularity: (() => {
      const sportsCount = users
        .flatMap((user) => user.interests?.sports || [])
        .reduce((acc, sport) => {
          acc[sport.name] = (acc[sport.name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      return Object.entries(sportsCount)?.map(([name, count]) => ({
        name,
        count
      }))
    })(),
    categoryPopularity: (() => {
      const categoriesCount = users
        .flatMap((user) => user.interests?.favoriteCategories || [])
        .reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      return Object.entries(categoriesCount)?.map(([name, count]) => ({
        name,
        count
      }))
    })(),
    ageDistribution: (() => {
      const ranges = [
        { range: '0-18', min: 0, max: 18 },
        { range: '19-25', min: 19, max: 25 },
        { range: '26-35', min: 26, max: 35 },
        { range: '36-50', min: 36, max: 50 },
        { range: '51+', min: 51, max: 120 }
      ]
      return ranges?.map((range) => ({
        ageRange: range.range,
        count: users.filter((user) => {
          const age = moment().diff(moment(user.birthDate), 'years')
          return age >= range.min && age <= range.max
        }).length
      }))
    })(),
    stateDistribution: (() => {
      const statesCount = users.reduce((acc, user) => {
        const state = user.address.state
        acc[state] = (acc[state] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      return Object.entries(statesCount)?.map(([state, count]) => ({
        state,
        count
      }))
    })(),
    recentUsers: users
      .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
      .slice(0, 5),
    topEngagedUsers: users
      .sort((a, b) => b.trustLevel - a.trustLevel)
      .slice(0, 5),

    // Dados de anúncios
    ads,
    totalAds: ads.length,
    approvedAdsPercentage: (() => {
      const approved = ads.filter((ad) => ad.status === 'approved').length
      return ads.length > 0 ? (approved / ads.length) * 100 : 0
    })(),
    averageAdPrice: (() => {
      const totalPrice = ads.reduce((sum, ad) => sum + ad.price, 0)
      return ads.length > 0 ? totalPrice / ads.length : 0
    })(),
    adStatusDistribution: (() => {
      const statusCount = ads.reduce((acc, ad) => {
        acc[ad.status] = (acc[ad.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      return Object.entries(statusCount)?.map(([status, count]) => ({
        status,
        count
      }))
    })(),
    adConditionDistribution: (() => {
      const conditionCount = ads.reduce((acc, ad) => {
        acc[ad.condition] = (acc[ad.condition] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      return Object.entries(conditionCount)?.map(([condition, count]) => ({
        condition,
        count
      }))
    })(),
    recentAds: ads
      .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
      .slice(0, 5),
    mostExpensiveAds: ads.sort((a, b) => b.price - a.price).slice(0, 5)
  }

  const contextValue: ReportsContextData = {
    reportsData,
    loading
  }

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  )
}

export const useReports = () => {
  const context = useContext(ReportsContext)
  if (!context)
    throw new Error('useReports must be used within a ReportsProvider')
  return context
}
