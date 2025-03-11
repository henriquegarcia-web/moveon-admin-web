// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Result, Table, theme } from 'antd'
import Fonts from '@/utils/styles/fonts'
import Colors from '@/utils/styles/colors'

const { useToken } = theme

export const StyledTable = styled(Table)<{ empty: number }>`
  width: 100%;
  max-width: 100%;
  table-layout: fixed;

  .ant-table-thead {
    th.ant-table-cell {
      align-items: center;
      height: 42px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:not(:first-of-type) {
        padding-top: 2px !important;
      }
    }
  }

  .ant-table-cell {
    padding: 0 16px !important;
    font-size: ${Fonts.xxxs};
    line-height: ${Fonts.xxxs};
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:last-of-type {
      display: flex;
      justify-content: flex-end;
    }
  }

  .ant-table-row {
    td {
      align-items: center;
      height: 50px !important;
    }

    &:last-of-type td {
      border-bottom: none;
    }
  }

  .ant-table-content table {
    border-radius: 8px;
    border: 1px solid ${() => useToken().token.colorBorderSecondary};
  }

  /* Estilização para colunas dinâmicas */
  ${({ columns }) =>
    columns &&
    columns.length > 0 &&
    `
    .ant-table-thead th,
    .ant-table-tbody td {
      ${columns
        .map(
          (col, index) => `
          &:nth-child(${index + 1}) {
            width: auto;
            min-width: 50px;
            max-width: ${
              col.width
                ? typeof col.width === 'number'
                  ? `${col.width}px`
                  : col.width
                : '100%'
            };
          }
        `
        )
        .join('')}
    }
  `}

  /* Estilização para estado vazio */
  ${({ empty }) =>
    empty > 0 &&
    `
    pointer-events: none;

    .ant-table-content {
      position: relative !important;
      border-radius: 8px;
    }

    tbody {
      height: 260px;
    }

    tbody .ant-table-cell {
      border: 2px solid red !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      border: none !important;
    }
  `}

  /* Estilização para estado carregando */
  ${({ loading }) =>
    loading &&
    `
    .ant-result {
      display: none;
    }
  `}
` as unknown as typeof Table

export const TableEmptyResult = styled(Result)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: 20px;

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
