// src/components/DetailsForm.tsx
import { useState } from 'react'
import * as S from './styles'
import { Descriptions, DescriptionsProps, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

export interface DetailsFormProps<T> extends DescriptionsProps {
  data: T // Tipo genérico para suportar qualquer estrutura de dados
  fields: {
    key: keyof T | string // Chave deve ser compatível com o tipo T
    label: string
    render?: (value: any) => React.ReactNode
  }[]
}

const DetailsForm = <T,>({ data, fields, ...rest }: DetailsFormProps<T>) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const handleCopy = (value: any) => {
    const textToCopy = value?.toString() || ''
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        message.success('Valor copiado para a área de transferência!')
      })
      .catch(() => {
        message.error('Falha ao copiar o valor.')
      })
  }

  return (
    <S.StyledDescriptions {...rest}>
      {fields.map(({ key, label, render }) => {
        const value = data[key as keyof T]
        const displayValue = render ? render(value) : value || '-'

        return (
          <Descriptions.Item key={key as string} label={label}>
            <div
              onMouseEnter={() => value && setHoveredKey(key as string)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <S.DescriptionContent>
                {typeof displayValue === 'object' && displayValue !== null
                  ? JSON.stringify(displayValue)
                  : String(displayValue)}
                {hoveredKey === key && value && (
                  <S.CopyButton
                    icon={<CopyOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(value)
                    }}
                    size="small"
                  />
                )}
              </S.DescriptionContent>
            </div>
          </Descriptions.Item>
        )
      })}
    </S.StyledDescriptions>
  )
}

export default DetailsForm
