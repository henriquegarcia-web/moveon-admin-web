// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Table, theme } from 'antd'

import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    font-size: ${Fonts.small};
    font-weight: 500;
  }
  .ant-table-tbody > tr > td {
    font-size: ${Fonts.xs};
  }
` as typeof Table
