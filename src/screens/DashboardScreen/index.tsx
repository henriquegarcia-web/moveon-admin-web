// src/screens/DashboardScreen/index.tsx

import { useState } from 'react'

import * as S from './styles'
import { LuPanelRightClose, LuPanelRightOpen } from 'react-icons/lu'

import { useAuth } from '@/contexts/AuthProvider'
import { useViews } from '@/contexts/ViewsProvider'
import { formatMenusForAntDesign } from '@/data/menus'
import { Button, Menu } from 'antd'

const DashboardScreen = () => {
  const { logout } = useAuth()
  const { activeMenu, setActiveMenu, loadingMenus } = useViews()

  const [sideMenuOpened, setSideMenuOpened] = useState(true)

  const toggleSideMenu = () => setSideMenuOpened(!sideMenuOpened)

  if (loadingMenus) return <div>Carregando dashboard...</div>

  const menuItems = formatMenusForAntDesign()

  return (
    <S.DashboardScreen>
      <S.DashboardSideMenu opened={sideMenuOpened ? 1 : 0}>
        <S.DashboardSideMenuHeader>
          <S.DashboardLogo
            opened={sideMenuOpened ? 1 : 0}
            src="/logo_green.png"
            alt="Logo MoveOn"
          />
        </S.DashboardSideMenuHeader>
        <S.DashboardSideMenuWrapper>
          <S.DashboardMenu
            mode="inline"
            selectedKeys={activeMenu ? [activeMenu.menuId] : []}
            items={menuItems}
            onClick={({ key }) => setActiveMenu(key)}
            opened={sideMenuOpened ? 1 : 0}
            style={{ borderRight: 0 }}
          />
        </S.DashboardSideMenuWrapper>
      </S.DashboardSideMenu>
      <S.DashboardMain>
        <S.DashboardMainHeader>
          <Button
            icon={sideMenuOpened ? <LuPanelRightOpen /> : <LuPanelRightClose />}
            onClick={toggleSideMenu}
          />
        </S.DashboardMainHeader>
        <S.DashboardMainViewsWrapper>
          <S.DashboardMainView>
            {activeMenu ? activeMenu.menuView : <div>Selecione um menu</div>}
          </S.DashboardMainView>
        </S.DashboardMainViewsWrapper>
      </S.DashboardMain>
    </S.DashboardScreen>
  )
}

export default DashboardScreen
