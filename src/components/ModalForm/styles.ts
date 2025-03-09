// src/components/UserMenu/styles.ts

import styled from 'styled-components'
import { Modal, theme } from 'antd'

import Fonts from '@/utils/styles/fonts'
import Colors from '@/utils/styles/colors'

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

  .ant-modal-body {
  }

  .ant-modal-close {
    top: 22px;
  }
`

export const StyledModalContent = styled.div<{ scrollbar: number }>`
  max-height: 500px;
  overflow: auto;
  padding-right: ${({ scrollbar }) => (scrollbar ? '10px' : '0')};

  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 10px;
    z-index: 1000;
  }

  &::-webkit-scrollbar-track {
    background: ${Colors.scrollbarTrack};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${Colors.scrollbarThumb};
  }
`
