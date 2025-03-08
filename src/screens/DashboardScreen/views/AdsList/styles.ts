// src/screens/DashboardScreen/views/AdsListView/styles.ts

import styled from 'styled-components'
import { Input as AntInput } from 'antd'

import { FormattedForm, View, ViewContent } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'

export const AdsListView = styled(View)`
  display: flex;
`

export const AdsListViewContent = styled(ViewContent)`
  display: flex;
  padding: 24px;
`

export const SearchInput = styled(AntInput)`
  width: 260px !important;
`

export const AdForm = styled(FormattedForm)``

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const AdsUpload = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 4px;
  cursor: pointer;

  p {
    font-size: ${Fonts.xxs};
    line-height: ${Fonts.xxs};
    font-weight: 400;
  }
`

export const AdsUploadLoading = styled.div<{ loading: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

  animation: ${({ loading }) => (loading ? 'spin 1s linear infinite' : 'none')};

  svg {
    font-size: ${Fonts.xxl};
    line-height: ${Fonts.xxl};
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`
