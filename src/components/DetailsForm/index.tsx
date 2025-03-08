// src/components/DetailsForm.tsx

import * as S from './styles'

import { Descriptions, DescriptionsProps } from 'antd'

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
  return (
    <S.StyledDescriptions {...rest}>
      {fields.map(({ key, label, render }) => (
        <Descriptions.Item key={key} label={label}>
          {render
            ? (render(data[key as keyof IUserProfile]) as React.ReactNode)
            : (data[key as keyof IUserProfile] as React.ReactNode) || '-'}
        </Descriptions.Item>
      ))}
    </S.StyledDescriptions>
  )
}

export default DetailsForm
