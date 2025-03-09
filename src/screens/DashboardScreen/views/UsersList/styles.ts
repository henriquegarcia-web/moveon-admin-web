// src/screens/DashboardScreen/views/UsersListView/styles.ts

import styled from 'styled-components'
import { Input as AntInput } from 'antd'

import { View, ViewContent } from '@/utils/styles/common'

export const UsersListView = styled(View)`
  display: flex;
`

export const UsersListViewContent = styled(ViewContent)`
  display: flex;
`

export const SearchInput = styled(AntInput)`
  width: 260px !important;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`
