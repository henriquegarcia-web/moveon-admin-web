import * as S from './styles'

interface IViewHeader {
  children?: React.ReactNode
}

const ViewHeader = ({ children }: IViewHeader) => {
  return <S.ViewHeader>{children}</S.ViewHeader>
}

export default ViewHeader
