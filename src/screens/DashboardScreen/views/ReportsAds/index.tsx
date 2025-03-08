import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IReportsAdsView {}

const ReportsAdsView = ({}: IReportsAdsView) => {
  return (
    <S.ReportsAdsView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.ReportsAdsViewContent></S.ReportsAdsViewContent>
    </S.ReportsAdsView>
  )
}

export default ReportsAdsView
