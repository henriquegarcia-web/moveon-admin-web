// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Table, theme } from 'antd'

import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const StyledTable = styled(Table)`
  /* .ant-table-thead > tr > th {
    font-size: ${Fonts.small};
    font-weight: 500;
  }
  .ant-table-tbody > tr > td {
    font-size: ${Fonts.xs};
  } */

  .ant-table-thead {
    th.ant-table-cell {
      align-items: center;
      height: 42px !important;

      &:not(&:first-of-type) {
        padding-top: 2px !important;
      }
    }
  }

  .ant-table-cell {
    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3) {
      white-space: nowrap;
    }

    padding: 0 16px !important;

    font-size: ${Fonts.xxxs};
    line-height: ${Fonts.xxxs};
    font-weight: 400;

    &:last-of-type {
      display: flex;
      justify-content: flex-end;
    }
  }

  .ant-table-row {
    td {
      align-items: center;
      height: 53px !important;
    }

    &:last-of-type td {
      border-bottom: none;
    }
  }

  .ant-table-content table {
    border-radius: 8px;

    border: 1px solid ${() => useToken().token.colorBorderSecondary};
  }
` as typeof Table
