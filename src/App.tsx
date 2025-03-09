// src/App.tsx

import AppRoutes from '@/Routes'
import { ConfigProvider, theme } from 'antd'

import dayjs from 'dayjs'
dayjs.locale('pt-br')

function App() {
  return <AppThemed />
}
import { App as AntdApp } from 'antd'

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
      <AntdApp>
        <AppRoutes />
      </AntdApp>
    </ConfigProvider>
  )
}
