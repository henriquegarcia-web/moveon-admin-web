// src/screens/DashboardScreen/views/AdsListView/styles.ts

import styled from 'styled-components'
import { Input as AntInput, Button, Image } from 'antd'

import { FormattedForm, View, ViewContent } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'

export const AdsListView = styled(View)`
  display: flex;
`

export const AdsListViewContent = styled(ViewContent)`
  display: flex;
`

export const SearchInput = styled(AntInput)`
  width: 260px !important;
`

export const AdForm = styled(FormattedForm)``

export const AdFormUploadMedia = styled.div`
  display: flex;
  column-gap: 10px;
`

export const AdFormMediasWrapper = styled.div`
  display: flex;
  flex: 1;
  column-gap: 10px;
`

export const AdFormMediaContainer = styled.div`
  position: relative;
  display: flex;

  .ant-image {
    overflow: hidden !important;
    border-radius: 10px !important;
  }
  .ant-image-mask-info {
    display: flex;
    align-items: center;

    svg {
      font-size: ${Fonts.regular} !important;
      line-height: ${Fonts.regular} !important;
    }

    font-size: ${Fonts.xxxs} !important;
    line-height: ${Fonts.xxxs} !important;
  }
`

export const AdFormMedia = styled(Image)`
  &.ant-image-img {
    object-fit: cover !important;
    object-position: center !important;
  }
`

export const AdFormMediaDelete = styled(Button)`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
`

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

  svg {
    font-size: ${Fonts.large};
  }

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
