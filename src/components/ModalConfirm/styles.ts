// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Modal, theme } from 'antd'

const { useToken } = theme

export const StyledConfirmModal = styled(Modal)`
  .ant-modal-body {
    padding: 16px 24px;
  }
  .ant-modal-footer {
    padding: 10px 16px;
  }
`
