// src/components/FormModal.tsx

import { ReactNode, useRef } from 'react'

import * as S from './styles'

import { ModalProps } from 'antd'
import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import { Schema } from 'yup'
import useScrollbar from '@/hooks/useScrollbar'

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
  const formContainerRef = useRef<HTMLDivElement>(null)

  const [containerHasScrollbar] = useScrollbar(formContainerRef, visible)

  return (
    <S.StyledModal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={width}
      centered
      {...rest}
    >
      <S.StyledModalContent
        ref={formContainerRef}
        scrollbar={containerHasScrollbar ? 1 : 0}
      >
        <FormProvider {...formMethods}>{children}</FormProvider>
      </S.StyledModalContent>
    </S.StyledModal>
  )
}

export default FormModal
