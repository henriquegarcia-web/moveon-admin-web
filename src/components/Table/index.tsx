// src/components/Table.tsx

import {
  TableProps as AntTableProps,
  Button,
  ConfigProvider,
  Result
} from 'antd'
import * as S from './styles'

import localeProvider from 'antd/locale/pt_BR'
import dayjs from 'dayjs'
dayjs.locale('pt-br')

export interface TableColumn<T> {
  title: string
  dataIndex?: keyof T | string
  key: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  sorter?: (a: T, b: T) => number
  filters?: { text: string; value: string | number }[]
  onFilter?: (value: any, record: T) => boolean
  width?: string | number
}

export interface TableProps<T> extends Omit<AntTableProps<T>, 'columns'> {
  columns: TableColumn<T>[]
  dataSource: T[]
  rowKey: keyof T | ((record: T) => string)
  loading?: boolean
  pagination?:
    | false
    | {
        pageSize?: number
        current?: number
        total?: number
        onChange?: (page: number, pageSize: number) => void
      }
  onRowClick?: (record: T) => void
  empty?: number
}

const Table = <T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination = { pageSize: 10 },
  onRowClick,
  ...rest
}: TableProps<T>) => {
  let locale = {
    emptyText: (
      <S.TableEmptyResult
        icon={<img src="/empty.png" alt="" />}
        title="Sem dados"
        subTitle="Não há informações para exibir no momento."
      />
    )
  }

  return (
    <ConfigProvider locale={localeProvider}>
      <S.StyledTable<T>
        locale={locale}
        columns={columns as any}
        dataSource={dataSource}
        rowKey={rowKey as any}
        loading={loading}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: onRowClick ? 'pointer' : 'default' }
        })}
        size="small"
        empty={dataSource.length === 0 ? 1 : 0}
        {...rest}
      />
    </ConfigProvider>
  )
}

export default Table
