import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IConditionsManagementView {}

const ConditionsManagementView = ({}: IConditionsManagementView) => {
  return (
    <S.ConditionsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.ConditionsManagementViewContent></S.ConditionsManagementViewContent>
    </S.ConditionsManagementView>
  )
}

export default ConditionsManagementView
