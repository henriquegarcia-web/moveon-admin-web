import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ISportsManagementView {}

const SportsManagementView = ({}: ISportsManagementView) => {
  return (
    <S.SportsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.SportsManagementViewContent></S.SportsManagementViewContent>
    </S.SportsManagementView>
  )
}

export default SportsManagementView
