import styled from 'styled-components'
import { theme } from 'antd'
import { ViewHeader as ViewHeaderCustom } from '@/utils/styles/common'

const { useToken } = theme

export const ViewHeader = styled(ViewHeaderCustom)`
  display: flex;
`

export const ViewHeaderLeftSide = styled.div`
  display: flex;
`

export const ViewHeaderRightSide = styled.div`
  display: flex;
`
