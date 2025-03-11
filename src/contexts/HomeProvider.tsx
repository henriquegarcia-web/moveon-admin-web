import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { useReports } from '@/contexts/ReportsProvider'
import { App } from 'antd'
import { IUserProfile, IAd, ReportsData } from '@/types'

interface HomeData {
  totalUsers: number
  totalAds: number
  verifiedUsersPercentage: number
  approvedAdsPercentage: number
  trustLevelAverage: number
  averageAdPrice: number
  userAgeDistribution: { ageRange: string; count: number }[]
  adStatusDistribution: { status: string; count: number }[]
  recentUsers: IUserProfile[]
  recentAds: IAd[]
}

interface HomeContextData {
  homeData: HomeData
  loading: boolean
}

const HomeContext = createContext<HomeContextData>({} as HomeContextData)

export const HomeProvider = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp()
  const { reportsData, loading: reportsLoading } = useReports()
  const [homeData, setHomeData] = useState<HomeData>({
    totalUsers: 0,
    totalAds: 0,
    verifiedUsersPercentage: 0,
    approvedAdsPercentage: 0,
    trustLevelAverage: 0,
    averageAdPrice: 0,
    userAgeDistribution: [],
    adStatusDistribution: [],
    recentUsers: [],
    recentAds: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      if (
        !reportsLoading &&
        reportsData?.users?.length > 0 &&
        reportsData?.ads?.length > 0
      ) {
        const newHomeData: HomeData = {
          totalUsers: reportsData.totalUsers,
          totalAds: reportsData.totalAds,
          verifiedUsersPercentage: reportsData.verifiedUsersPercentage,
          approvedAdsPercentage: reportsData.approvedAdsPercentage,
          trustLevelAverage: reportsData.trustLevelAverage,
          averageAdPrice: reportsData.averageAdPrice,
          userAgeDistribution: reportsData.ageDistribution,
          adStatusDistribution: reportsData.adStatusDistribution,
          recentUsers: reportsData.recentUsers,
          recentAds: reportsData.recentAds
        }
        setHomeData(newHomeData)
      }
    } catch (error) {
      message.error(
        'Erro ao processar dados da home: ' + (error as Error).message
      )
    } finally {
      setLoading(reportsLoading)
    }
  }, [reportsData, reportsLoading, message])

  const contextValue: HomeContextData = {
    homeData,
    loading
  }

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  )
}

export const useHome = () => {
  const context = useContext(HomeContext)
  if (!context) throw new Error('useHome must be used within a HomeProvider')
  return context
}
