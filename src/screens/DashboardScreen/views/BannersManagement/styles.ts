// src/screens/DashboardScreen/views/BannersManagementView/styles.ts

import styled from 'styled-components'
import { FormattedForm, View, ViewContent } from '@/utils/styles/common'
import { Form, Input } from 'antd'

export const BannersManagementView = styled(View)`
  display: flex;
  flex-direction: column;
`

export const BannersManagementViewContent = styled(ViewContent)`
  display: flex;
  flex-direction: column;

  td.ant-table-cell {
    height: 70px !important;
  }
`

export const SearchInput = styled(Input)``

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const ImageThumbnail = styled.img`
  width: 175px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: -3px;
`

export const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  margin-top: 8px;
  border-radius: 4px;
`

export const ImageSizeHint = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
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
