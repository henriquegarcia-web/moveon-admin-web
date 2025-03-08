// src/screens/DashboardScreen/styles.ts

import styled from 'styled-components'
import { theme } from 'antd'

import { Globals, Screen } from '@/utils/styles/globals'
import { FormattedMenu } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'
import Colors from '@/utils/styles/colors'

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
  position: relative;
  height: ${Globals.dashboard.headerHeight};

  border-bottom: 1px solid ${() => useToken().token.colorBorderSecondary};
`

export const DashboardLogo = styled.div`
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background-color: white;
`

export const DashboardLogoImg = styled.img<{ opened: number }>`
  display: flex;
  height: ${({ opened }) => (opened ? '70%' : '40%')};
  transition: 0.3s;
`

export const DashboardSideMenuWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${Globals.dashboard.headerHeight});
  padding: 10px;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
`

export const DashboardMenu = styled(FormattedMenu)``

// =================================================== DASHBOARD MAIN

export const DashboardMain = styled.div<{ opened: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ opened }) =>
    opened
      ? `calc(100% - ${Globals.dashboard.menuWidth.opened})`
      : `calc(100% - ${Globals.dashboard.menuWidth.closed})`};
  height: 100vh;
`

export const DashboardMainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${Globals.dashboard.headerHeight};
  padding: 0 ${Globals.dashboard.padding};

  border-bottom: 1px solid ${() => useToken().token.colorBorderSecondary};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
`

export const DashboardActiveViewLabel = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  margin: 0 auto 0 12px;

  h2 {
    font-size: ${Fonts.xs};
    line-height: ${Fonts.xs};
    font-weight: 500;

    color: ${() => useToken().token.colorTextHeading};
  }

  p {
    font-size: ${Fonts.xxxs};
    line-height: ${Fonts.xxxs};
    font-weight: 300;

    color: ${() => useToken().token.colorTextLabel};
  }
`

export const DashboardMainViewsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100% - ${Globals.dashboard.headerHeight});
  overflow: auto;
  padding: ${Globals.dashboard.padding} 0;

  background-color: rgba(0, 0, 0, 0.02);

  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 10px;
    z-index: 1000;
  }

  &::-webkit-scrollbar-track {
    background: ${Colors.scrollbarTrack};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${Colors.scrollbarThumb};
  }
`

export const DashboardMainView = styled.div`
  display: flex;
  width: 100%;
  max-width: ${Globals.dashboard.view.maxWidth};
  height: fit-content;
`
