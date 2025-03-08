// src/components/ConfirmModal.tsx

import { ReactNode } from 'react'
import { ButtonProps, ModalProps } from 'antd'
import * as S from './styles'

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
  type?: 'default' | 'danger'
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
  type = 'default',
  ...rest
}: ConfirmModalProps) => {
  const okButtonProps: ButtonProps = {
    danger: type === 'danger'
  }

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
      okButtonProps={okButtonProps}
      centered
      {...rest}
    >
      {content}
    </S.StyledConfirmModal>
  )
}

export default ConfirmModal
