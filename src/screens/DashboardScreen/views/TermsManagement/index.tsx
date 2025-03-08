import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ITermsManagementView {}

const TermsManagementView = ({}: ITermsManagementView) => {
  return (
    <S.TermsManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.TermsManagementViewContent></S.TermsManagementViewContent>
    </S.TermsManagementView>
  )
}

export default TermsManagementView
