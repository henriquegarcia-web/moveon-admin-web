// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Tag, theme, Typography } from 'antd'

import Fonts from '@/utils/styles/fonts'

const { Paragraph, Text, Link } = Typography
const { useToken } = theme

export const UserMenu = styled.div`
  display: flex;
  cursor: pointer;
`

export const UserMenuInfos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  row-gap: 5px;
  margin-right: 10px;
`

export const UserWelcome = styled(Text)`
  font-size: ${Fonts.xs};
  line-height: ${Fonts.xs};
  font-weight: 300;

  b {
    font-weight: 500;
  }
`
