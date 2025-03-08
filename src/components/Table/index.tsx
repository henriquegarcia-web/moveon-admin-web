// src/components/Table.tsx

import { TableProps as AntTableProps } from 'antd'
import * as S from './styles'

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
  return (
    <S.StyledTable<T>
      columns={columns as any}
      dataSource={dataSource}
      rowKey={rowKey as any}
      loading={loading}
      pagination={pagination}
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        style: { cursor: onRowClick ? 'pointer' : 'default' }
      })}
      {...rest}
    />
  )
}

export default Table
