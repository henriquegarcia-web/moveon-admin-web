import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IReportsUsersView {}

const ReportsUsersView = ({}: IReportsUsersView) => {
  return (
    <S.ReportsUsersView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.ReportsUsersViewContent></S.ReportsUsersViewContent>
    </S.ReportsUsersView>
  )
}

export default ReportsUsersView
