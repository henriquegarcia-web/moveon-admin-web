import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IChatsManagementView {}

const ChatsManagementView = ({}: IChatsManagementView) => {
  return (
    <S.ChatsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.ChatsManagementViewContent></S.ChatsManagementViewContent>
    </S.ChatsManagementView>
  )
}

export default ChatsManagementView
