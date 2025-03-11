// src/screens/DashboardScreen/views/AdvertisingManagementView/styles.ts

import styled from 'styled-components'
import { FormattedForm, View, ViewContent } from '@/utils/styles/common'
import { Input } from 'antd'

export const AdvertisingManagementView = styled(View)`
  display: flex;
`

export const AdvertisingManagementViewContent = styled(ViewContent)`
  display: flex;
`

export const SearchInput = styled(Input)``

export const CampaignForm = styled(FormattedForm)`
  width: 100%;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const ImagePreview = styled.img`
  width: 100%;
  margin-top: 8px;
  border-radius: 4px;
`

export const ChartContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`
