import * as S from './styles'

interface IViewHeader {
  children?: React.ReactNode
}

const ViewHeader = ({ children }: IViewHeader) => {
  return (
    <S.ViewHeader>
      <S.ViewHeaderLeftSide></S.ViewHeaderLeftSide>
      <S.ViewHeaderRightSide>{children}</S.ViewHeaderRightSide>
    </S.ViewHeader>
  )
}

export default ViewHeader
