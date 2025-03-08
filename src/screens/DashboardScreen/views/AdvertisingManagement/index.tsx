import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IAdvertisingManagementView {}

const AdvertisingManagementView = ({}: IAdvertisingManagementView) => {
  return (
    <S.AdvertisingManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.AdvertisingManagementViewContent></S.AdvertisingManagementViewContent>
    </S.AdvertisingManagementView>
  )
}

export default AdvertisingManagementView
