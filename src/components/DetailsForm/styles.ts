// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Descriptions, theme } from 'antd'
import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    padding: 6px 10px !important;

    font-size: ${Fonts.xxxs};
    font-weight: 400;
  }

  .ant-descriptions-item-content {
    padding: 8px 12px !important;

    font-size: ${Fonts.xxxs};
    font-weight: 400;
  }
`
