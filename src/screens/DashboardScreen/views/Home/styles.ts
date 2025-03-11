// src/components/HomeView/styles.ts

import styled from 'styled-components'
import { Card } from 'antd'

import { View, ViewContent } from '@/utils/styles/common'

export const HomeView = styled(View)`
  display: flex;
`

export const HomeViewContent = styled(ViewContent)`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`

export const ShortcutsCard = styled(Card)`
  /* display: flex; */
`

export const ShortcutsMenu = styled.div`
  display: flex;
  gap: 10px;
`
