import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface IAdsApprovalView {}

const AdsApprovalView = ({}: IAdsApprovalView) => {
  return (
    <S.AdsApprovalView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.AdsApprovalViewContent></S.AdsApprovalViewContent>
    </S.AdsApprovalView>
  )
}

export default AdsApprovalView
