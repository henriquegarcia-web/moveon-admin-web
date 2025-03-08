import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IHomeView {}

const HomeView = ({}: IHomeView) => {
  return (
    <S.HomeView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.HomeViewContent></S.HomeViewContent>
    </S.HomeView>
  )
}

export default HomeView
