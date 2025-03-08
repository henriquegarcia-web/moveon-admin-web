import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IMyAccountView {}

const MyAccountView = ({}: IMyAccountView) => {
  return (
    <S.MyAccountView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.MyAccountViewContent></S.MyAccountViewContent>
    </S.MyAccountView>
  )
}

export default MyAccountView
