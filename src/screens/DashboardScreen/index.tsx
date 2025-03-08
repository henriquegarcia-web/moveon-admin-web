import * as S from './styles'

import { useAuth } from '@/contexts/AuthProvider'

const DashboardScreen = () => {
  const { logout } = useAuth()
  return (
    <S.DashboardScreen>
      <button onClick={logout}>Sair</button>
    </S.DashboardScreen>
  )
}

export default DashboardScreen
