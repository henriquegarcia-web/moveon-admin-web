// src/App.tsx

import AppRoutes from '@/Routes'
import { ConfigProvider, theme } from 'antd'

function App() {
  return <AppThemed />
}

export default App

const AppThemed = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#01be62'
        }
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  )
}
