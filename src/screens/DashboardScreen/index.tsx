// src/screens/DashboardScreen/index.tsx

import * as S from './styles'

import { useAuth } from '@/contexts/AuthProvider'
import { useViews } from '@/contexts/ViewsProvider'
import { getMenuCategories } from '@/data/menus'

const DashboardScreen = () => {
  const { logout } = useAuth()
  const { activeMenu, setActiveMenu, menus, loadingMenus } = useViews()

  if (loadingMenus) return <div>Carregando dashboard...</div>

  // Agrupar menus por categoria para exibição
  const menuCategories = getMenuCategories()

  return (
    <S.DashboardScreen>
      <button onClick={logout}>Sair</button>
    </S.DashboardScreen>
  )
}

export default DashboardScreen
