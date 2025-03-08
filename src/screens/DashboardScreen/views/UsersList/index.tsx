import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IUsersListView {}

const UsersListView = ({}: IUsersListView) => {
  return (
    <S.UsersListView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.UsersListViewContent></S.UsersListViewContent>
    </S.UsersListView>
  )
}

export default UsersListView
