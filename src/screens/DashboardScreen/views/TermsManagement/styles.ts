// src/components/TermsManagementView/styles.ts

import styled from 'styled-components'
import { Card, theme } from 'antd'

import { View, ViewContent, FormattedForm } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const TermsManagementView = styled(View)`
  display: flex;
`

export const TermsManagementViewContent = styled(ViewContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const TermCard = styled(Card)`
  margin: 0 !important;

  .ant-card-head {
    height: fit-content !important;
    min-height: fit-content !important;
    padding: 12px 14px;

    font-size: ${Fonts.small} !important;
    line-height: ${Fonts.small} !important;
    font-weight: 500 !important;

    color: ${() => useToken().token.colorTextHeading};
  }

  .ant-card-body {
    padding: 14px;
  }
`

export const TermContent = styled.div`
  p {
    font-size: ${Fonts.xxxs} !important;
    line-height: ${Fonts.xxxs} !important;
    font-weight: 400;

    color: ${() => useToken().token.colorTextLabel};
  }
`

export const TermForm = styled(FormattedForm)`
  width: 100%;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`

export const TermContentView = styled.div`
  p {
    margin: 8px 0;
  }
`
