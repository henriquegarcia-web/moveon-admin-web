// src/components/FormModal.tsx

import { ReactNode } from 'react'

import * as S from './styles'

import { ModalProps } from 'antd'
import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import { Schema } from 'yup'

export interface FormModalProps<T extends FieldValues>
  extends Omit<ModalProps, 'footer' | 'onOk' | 'onCancel'> {
  visible: boolean
  onClose: () => void
  title: string
  formMethods: UseFormReturn<T>
  validationSchema?: Schema<T>
  children: ReactNode
}

const FormModal = <T extends object>({
  visible,
  onClose,
  title,
  formMethods,
  children,
  width = 520,
  ...rest
}: FormModalProps<T>) => {
  return (
    <S.StyledModal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={width}
      {...rest}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </S.StyledModal>
  )
}

export default FormModal
