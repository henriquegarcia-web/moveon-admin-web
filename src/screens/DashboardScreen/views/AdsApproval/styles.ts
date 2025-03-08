// src/screens/DashboardScreen/views/AdsApprovalView/styles.ts

import styled from 'styled-components'
import { Input as AntInput } from 'antd'

import { View, ViewContent } from '@/utils/styles/common'

export const AdsApprovalView = styled(View)`
  display: flex;
`

export const AdsApprovalViewContent = styled(ViewContent)`
  display: flex;
  padding: 24px;
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

export const VideoPreview = styled.video`
  width: 100%;
  max-height: 300px;
  margin-bottom: 16px;
`

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`

export const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`
