// src/components/ConfirmModal.tsx

import { ReactNode } from 'react'

import * as S from './styles'

import { ModalProps } from 'antd'

export interface ConfirmModalProps
  extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  content: ReactNode
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
}

const ConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
  title,
  content,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmLoading = false,
  width = 400,
  ...rest
}: ConfirmModalProps) => {
  return (
    <S.StyledConfirmModal
      title={title}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      width={width}
      {...rest}
    >
      {content}
    </S.StyledConfirmModal>
  )
}

export default ConfirmModal
