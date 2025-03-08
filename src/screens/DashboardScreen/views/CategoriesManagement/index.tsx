import * as S from './styles'

import { Button } from 'antd'

import { ViewHeader } from '@/components'

interface ICategoriesManagementView {}

const CategoriesManagementView = ({}: ICategoriesManagementView) => {
  return (
    <S.CategoriesManagementView>
      <ViewHeader>
        <Button type="primary" onClick={() => {}}>
          Teste
        </Button>
      </ViewHeader>
      <S.CategoriesManagementViewContent></S.CategoriesManagementViewContent>
    </S.CategoriesManagementView>
  )
}

export default CategoriesManagementView
