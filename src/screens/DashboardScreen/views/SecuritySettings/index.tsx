import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ISecuritySettingsView {}

const SecuritySettingsView = ({}: ISecuritySettingsView) => {
  return (
    <S.SecuritySettingsView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.SecuritySettingsViewContent></S.SecuritySettingsViewContent>
    </S.SecuritySettingsView>
  )
}

export default SecuritySettingsView
