import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IAccessManagementView {}

const AccessManagementView = ({}: IAccessManagementView) => {
  return (
    <S.AccessManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.AccessManagementViewContent></S.AccessManagementViewContent>
    </S.AccessManagementView>
  )
}

export default AccessManagementView
