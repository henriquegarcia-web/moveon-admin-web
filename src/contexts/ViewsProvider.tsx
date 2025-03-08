// src/contexts/ViewsProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ADMIN_MENUS, IMenu } from '@/data/menus'

interface ViewsContextData {
  activeMenu: IMenu | null
  setActiveMenu: (menuId: string) => void
  menus: IMenu[]
  loadingMenus: boolean
}

const ViewsContext = createContext<ViewsContextData>({} as ViewsContextData)

export const ViewsProvider = ({ children }: { children: ReactNode }) => {
  const { menuId } = useParams<{ menuId?: string }>()
  const navigate = useNavigate()

  const [activeMenu, setActiveMenuState] = useState<IMenu | null>(null)
  const [loading, setLoading] = useState(true)

  const setActiveMenu = (id: string) => {
    const menu = ADMIN_MENUS.find((m) => m.menuId === id)
    if (menu && !menu.menuDisabled) {
      setActiveMenuState(menu)
      navigate(`/admin/${id}`)
    } else {
      navigate(`/admin/${ADMIN_MENUS[0].menuId}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    if (!menuId) {
      navigate(`/admin/${ADMIN_MENUS[0].menuId}`)
    } else {
      const menu = ADMIN_MENUS.find((m) => m.menuId === menuId)
      if (menu && !menu.menuDisabled) {
        setActiveMenuState(menu)
      } else {
        navigate(`/admin/${ADMIN_MENUS[0].menuId}`)
      }
    }
    setLoading(false)
  }, [menuId, navigate])

  const contextValue: ViewsContextData = {
    activeMenu,
    setActiveMenu,
    menus: ADMIN_MENUS.filter((m) => !m.menuHidden),
    loadingMenus: loading
  }

  return (
    <ViewsContext.Provider value={contextValue}>
      {children}
    </ViewsContext.Provider>
  )
}

export const useViews = () => {
  const context = useContext(ViewsContext)
  if (!context) throw new Error('useViews must be used within a ViewsProvider')
  return context
}
