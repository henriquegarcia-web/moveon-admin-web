// src/components/DetailsForm.tsx

import { useState } from 'react'

import * as S from './styles'

import { Descriptions, DescriptionsProps, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import { IUserProfile } from '@/types'

export interface DetailsFormProps extends DescriptionsProps {
  data: IUserProfile
  fields: {
    key: keyof IUserProfile | string
    label: string
    render?: (value: any) => React.ReactNode
  }[]
}

const DetailsForm = ({ data, fields, ...rest }: DetailsFormProps) => {
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
        const value = data[key as keyof IUserProfile]
        const displayValue = render ? render(value) : value || '-'

        return (
          <Descriptions.Item key={key} label={label}>
            <div
              onMouseEnter={() => value && setHoveredKey(key as string)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <S.DescriptionContent>
                {typeof displayValue === 'object'
                  ? JSON.stringify(displayValue)
                  : displayValue}
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
