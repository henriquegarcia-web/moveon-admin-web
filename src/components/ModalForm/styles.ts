// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Modal, theme } from 'antd'

const { useToken } = theme

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding: 16px 24px;
  }
  .ant-modal-body {
    padding: 24px;
  }
`
