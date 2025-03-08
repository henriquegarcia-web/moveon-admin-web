// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Descriptions, theme, Button } from 'antd'

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

export const DescriptionContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CopyButton = styled(Button)`
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    color: #af6dac;
  }
`
