// src/screens/DashboardScreen/views/AccessManagementView/styles.ts

import styled from 'styled-components'
import { Input as AntInput } from 'antd'

import { FormattedForm, View, ViewContent } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'

export const AccessManagementView = styled(View)`
  display: flex;
`

export const AccessManagementViewContent = styled(ViewContent)`
  display: flex;
`

export const Input = styled(AntInput)`
  width: 100%;
`

export const SearchInput = styled(AntInput)`
  width: 260px !important;
`

export const CreateAccessForm = styled(FormattedForm)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`
