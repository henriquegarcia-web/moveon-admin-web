// src/screens/DashboardScreen/styles.ts

import styled from 'styled-components'
import { theme } from 'antd'

import { Globals, Screen } from '@/utils/styles/globals'
import { FormattedMenu } from '@/utils/styles/common'

const { useToken } = theme

export const DashboardScreen = styled(Screen)`
  display: flex;
  flex-direction: row;
`

// =================================================== DASHBOARD MENU

export const DashboardSideMenu = styled.div<{ opened: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ opened }) =>
    opened
      ? Globals.dashboard.menuWidth.opened
      : Globals.dashboard.menuWidth.closed};
  transition: 0.3s;

  border-right: 1px solid ${() => useToken().token.colorBorderSecondary};
`

export const DashboardSideMenuHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${Globals.dashboard.headerHeight};

  border-bottom: 1px solid ${() => useToken().token.colorBorderSecondary};
`

export const DashboardLogo = styled.img<{ opened: number }>`
  display: flex;
  height: ${({ opened }) => (opened ? '70%' : '40%')};
  transition: 0.3s;
`

export const DashboardSideMenuWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${Globals.dashboard.headerHeight});
  padding: 10px;
`

export const DashboardMenu = styled(FormattedMenu)``

// =================================================== DASHBOARD MAIN

export const DashboardMain = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const DashboardMainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${Globals.dashboard.headerHeight};
  padding: 0 ${Globals.dashboard.padding};

  border-bottom: 1px solid ${() => useToken().token.colorBorderSecondary};
`

export const DashboardMainViewsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${Globals.dashboard.headerHeight});
`

export const DashboardMainView = styled.div`
  display: flex;
`
