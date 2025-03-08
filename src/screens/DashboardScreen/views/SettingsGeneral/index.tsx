import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ISettingsGeneralView {}

const SettingsGeneralView = ({}: ISettingsGeneralView) => {
  return (
    <S.SettingsGeneralView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.SettingsGeneralViewContent></S.SettingsGeneralViewContent>
    </S.SettingsGeneralView>
  )
}

export default SettingsGeneralView
