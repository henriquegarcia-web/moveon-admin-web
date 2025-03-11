// src/components/HomeView/index.tsx

import * as S from './styles'
import { useHome } from '@/contexts/HomeProvider'
import {
  Card,
  Statistic,
  Row,
  Col,
  List,
  Avatar,
  Spin,
  Tabs,
  Button
} from 'antd'
import { UserOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons'
import { Pie, Column } from '@ant-design/charts'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

interface IHomeView {}

const HomeView = ({}: IHomeView) => {
  const { homeData, loading } = useHome()
  const navigate = useNavigate()

  const quickNavItems = [
    {
      key: 'terms',
      label: 'Gerenciar Termos',
      icon: <HomeOutlined />,
      path: '/admin/usuarios-relatorios'
    },
    {
      key: 'users',
      label: 'Relatórios de Usuários',
      icon: <UserOutlined />,
      path: '/reports/users'
    },
    {
      key: 'ads',
      label: 'Relatórios de Anúncios',
      icon: <ShoppingOutlined />,
      path: '/reports/ads'
    }
  ]

  return (
    <S.HomeView>
      <S.HomeViewContent>
        {loading ? (
          <Spin size="large" style={{ margin: 'auto' }} />
        ) : (
          <>
            <S.ShortcutsCard title="Navegação Rápida">
              <S.ShortcutsMenu>
                {quickNavItems.map((item) => (
                  <Button
                    key={item.key}
                    icon={item.icon}
                    onClick={() => navigate(item.path)}
                    size="large"
                  >
                    {item.label}
                  </Button>
                ))}
              </S.ShortcutsMenu>
            </S.ShortcutsCard>

            {/* Indicadores Gerais */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total de Usuários"
                    value={homeData.totalUsers}
                    suffix="usuários"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Usuários Verificados"
                    value={homeData.verifiedUsersPercentage}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total de Anúncios"
                    value={homeData.totalAds}
                    suffix="anúncios"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Anúncios Aprovados"
                    value={homeData.approvedAdsPercentage}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Média de Confiança"
                    value={homeData.trustLevelAverage}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Preço Médio de Anúncio"
                    value={homeData.averageAdPrice}
                    precision={2}
                    prefix="R$"
                  />
                </Card>
              </Col>
            </Row>

            {/* Gráficos */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Distribuição de Idades dos Usuários">
                  <Column
                    data={homeData.userAgeDistribution}
                    xField="ageRange"
                    yField="count"
                    label={{
                      position: 'middle',
                      style: { fill: '#FFFFFF', opacity: 0.6 }
                    }}
                    xAxis={{ label: { autoHide: true, autoRotate: false } }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Distribuição de Status dos Anúncios">
                  <Pie
                    data={homeData.adStatusDistribution}
                    angleField="count"
                    colorField="status"
                    radius={0.8}
                    label={{
                      type: 'inner',
                      offset: '-50%',
                      content: '{value}',
                      style: { textAlign: 'center' }
                    }}
                    interactions={[
                      { type: 'element-selected' },
                      { type: 'element-active' }
                    ]}
                  />
                </Card>
              </Col>
            </Row>

            {/* Listagens */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Usuários Recentes">
                  <List
                    itemLayout="horizontal"
                    dataSource={homeData.recentUsers}
                    renderItem={(user) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={user.profilePicture || <UserOutlined />}
                            />
                          }
                          title={user.name}
                          description={`CPF: ${user.cpf} | Cadastro: ${moment(
                            user.createdAt
                          ).format('DD/MM/YYYY HH:mm')}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Anúncios Recentes">
                  <List
                    itemLayout="horizontal"
                    dataSource={homeData.recentAds}
                    renderItem={(ad) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<ShoppingOutlined />} />}
                          title={ad.title}
                          description={`Preço: R$${ad.price.toFixed(
                            2
                          )} | Status: ${ad.status}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </S.HomeViewContent>
    </S.HomeView>
  )
}

export default HomeView
