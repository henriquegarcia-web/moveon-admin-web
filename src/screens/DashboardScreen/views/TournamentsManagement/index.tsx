import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ITournamentsManagementView {}

const TournamentsManagementView = ({}: ITournamentsManagementView) => {
  return (
    <S.TournamentsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.TournamentsManagementViewContent></S.TournamentsManagementViewContent>
    </S.TournamentsManagementView>
  )
}

export default TournamentsManagementView
