import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface INotificationsManagementView {}

const NotificationsManagementView = ({}: INotificationsManagementView) => {
  return (
    <S.NotificationsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.NotificationsManagementViewContent></S.NotificationsManagementViewContent>
    </S.NotificationsManagementView>
  )
}

export default NotificationsManagementView
