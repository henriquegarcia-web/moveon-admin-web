// src/screens/DashboardScreen/views/AccessManagementView/styles.ts

import styled from 'styled-components'
import { View, ViewContent } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'
import { Input as AntInput } from 'antd'

export const AccessManagementView = styled(View)`
  display: flex;
`

export const AccessManagementViewContent = styled(ViewContent)`
  display: flex;
  padding: 24px;
`

export const FormItem = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: ${Fonts.small};
    margin-bottom: 4px;
  }
`

export const Input = styled(AntInput)`
  width: 100%;
`

export const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: ${Fonts.xs};
  margin-top: 4px;
  display: block;
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
