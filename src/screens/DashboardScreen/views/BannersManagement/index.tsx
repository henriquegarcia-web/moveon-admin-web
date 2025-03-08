import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IBannersManagementView {}

const BannersManagementView = ({}: IBannersManagementView) => {
  return (
    <S.BannersManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.BannersManagementViewContent></S.BannersManagementViewContent>
    </S.BannersManagementView>
  )
}

export default BannersManagementView
