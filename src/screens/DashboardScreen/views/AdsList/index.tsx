import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IAdsListView {}

const AdsListView = ({}: IAdsListView) => {
  return (
    <S.AdsListView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.AdsListViewContent></S.AdsListViewContent>
    </S.AdsListView>
  )
}

export default AdsListView
