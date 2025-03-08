// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Modal, theme } from 'antd'
import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding: 10px 0;
    margin-bottom: 20px;

    .ant-modal-title {
      font-size: ${Fonts.large};
      line-height: ${Fonts.large};
      font-weight: 500;
    }
  }

  .ant-modal-close {
    top: 22px;
  }
`
