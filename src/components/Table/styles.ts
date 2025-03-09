// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Result, Table, theme } from 'antd'

import Fonts from '@/utils/styles/fonts'
import Colors from '@/utils/styles/colors'

const { useToken } = theme

export const StyledTable = styled(Table)<{ empty: number }>`
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

  ${({ empty }) =>
    empty &&
    `
      height: 260px;
      pointer-events: none;
      
      table {
        border: none !important;
      }

      .ant-table-content {
        position: relative;
        border-radius: 8px;
      }

      tbody .ant-table-cell {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border: none !important;
      }
    `}
` as typeof Table

export const TableEmptyResult = styled(Result)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 10px);

  img {
    width: 90px;
    margin-bottom: -10px;
  }

  .ant-result-title {
    font-size: ${Fonts.large};
    line-height: ${Fonts.large};
    font-weight: 500;
  }

  .ant-result-subtitle {
    font-size: ${Fonts.xxs};
    line-height: ${Fonts.xxs};
    font-weight: 400;
  }
`
