// src/components/UserMenu/index.tsx

import { useNavigate } from 'react-router-dom'
import * as S from './styles'

import { Avatar, Dropdown, theme } from 'antd'
import type { MenuProps } from 'antd'

import { formatUsername } from '@/utils/functions/formatUsername'
import { ADMIN_USER_MENU } from '@/data/menus'
import { useAuth } from '@/contexts/AuthProvider'

interface IUserMenu {}

const UserMenu = ({}: IUserMenu) => {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { handleLogout, admin } = useAuth()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'user_exit') {
      handleLogout()
      return
    }

    navigate(`/admin/${e.key}`)
  }

  const formattedMenus: MenuProps['items'] = ADMIN_USER_MENU.map((menu) => ({
    key: menu.menuId,
    label: menu.menuName,
    icon: menu.menuIcon,
    disabled: menu.menuDisabled
  }))

  const menuProps = {
    items: formattedMenus || [],
    onClick: handleMenuClick
  }

  const name = `${admin?.name}`

  return (
    <Dropdown menu={menuProps} placement="bottomRight">
      <S.UserMenu>
        <S.UserMenuInfos>
          <S.UserWelcome>
            {admin ? (
              <>
                Olá, <b>{name}</b>
              </>
            ) : (
              <>Carregando...</>
            )}
          </S.UserWelcome>
        </S.UserMenuInfos>

        <Avatar
          size={34}
          style={{
            paddingTop: 2,
            fontSize: 15,
            backgroundColor: token.colorPrimary
          }}
        >
          {formatUsername(name || '')}
        </Avatar>
      </S.UserMenu>
    </Dropdown>
  )
}

export default UserMenu

// {/* <button onClick={handleLogout}>Sair</button> */}
