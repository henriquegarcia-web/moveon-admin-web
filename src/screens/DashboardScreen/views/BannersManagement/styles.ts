// src/screens/DashboardScreen/views/BannersManagementView/styles.ts

import styled from 'styled-components'
import { Input } from 'antd'

import { FormattedForm } from '@/utils/styles/common'
import { View, ViewContent } from '@/utils/styles/common'

export const BannersManagementView = styled(View)`
  display: flex;
  flex-direction: column;
`

export const BannersManagementViewContent = styled(ViewContent)`
  display: flex;
  flex-direction: column;
`

export const SearchInput = styled(Input)`
  margin-right: 16px;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const ImageThumbnail = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`

export const ImagePreview = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  margin-top: 8px;
  border-radius: 4px;
`

export const BannerForm = styled(FormattedForm)`
  width: 100%;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`

export const ChartContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
`
