import * as S from './styles'
import { useReports } from '@/contexts/ReportsProvider'
import {
  Button,
  Card,
  Statistic,
  Row,
  Col,
  List,
  Avatar,
  Spin,
  DatePicker
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { ViewHeader } from '@/components'
import { Pie, Column } from '@ant-design/charts'
import moment from 'moment'
import { useState } from 'react'

interface IReportsUsersView {}

const ReportsUsersView = ({}: IReportsUsersView) => {
  const { reportsData, loading } = useReports()
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null)

  // Filtrar dados apenas se reportsData.users estiver disponível
  const filteredUsers =
    !loading && reportsData?.users?.length > 0
      ? dateRange
        ? reportsData.users.filter((user) =>
            moment(user.createdAt).isBetween(
              dateRange[0],
              dateRange[1],
              undefined,
              '[]'
            )
          )
        : reportsData.users
      : []

  // Calcular filteredReportsData apenas se houver dados
  const filteredReportsData =
    !loading && reportsData?.users?.length > 0
      ? {
          ...reportsData,
          totalUsers: filteredUsers.length,
          verifiedUsersPercentage: (() => {
            const verified = filteredUsers.filter(
              (user) => user.isVerified
            ).length
            return filteredUsers.length > 0
              ? (verified / filteredUsers.length) * 100
              : 0
          })(),
          trustLevelAverage: (() => {
            const totalTrust = filteredUsers.reduce(
              (sum, user) => sum + user.trustLevel,
              0
            )
            return filteredUsers.length > 0
              ? totalTrust / filteredUsers.length
              : 0
          })(),
          sportPopularity: reportsData.sportPopularity.map((item) => ({
            ...item,
            count: filteredUsers
              .flatMap((user) => user.interests?.sports || [])
              .filter((s) => s.name === item.name).length
          })),
          categoryPopularity: reportsData.categoryPopularity.map((item) => ({
            ...item,
            count: filteredUsers
              .flatMap((user) => user.interests?.favoriteCategories || [])
              .filter((c) => c === item.name).length
          })),
          ageDistribution: reportsData.ageDistribution.map((item) => ({
            ...item,
            count: filteredUsers.filter((user) => {
              const age = moment().diff(moment(user.birthDate), 'years')
              const [min, max] = item.ageRange.split('-').map(Number)
              return age >= (min || 0) && age <= (max || 120)
            }).length
          })),
          stateDistribution: reportsData.stateDistribution.map((item) => ({
            ...item,
            count: filteredUsers.filter(
              (user) => user.address.state === item.state
            ).length
          })),
          recentUsers: filteredUsers
            .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
            .slice(0, 5),
          topEngagedUsers: filteredUsers
            .sort((a, b) => b.trustLevel - a.trustLevel)
            .slice(0, 5)
        }
      : {
          ...reportsData,
          totalUsers: 0,
          verifiedUsersPercentage: 0,
          trustLevelAverage: 0,
          sportPopularity: [],
          categoryPopularity: [],
          ageDistribution: [],
          stateDistribution: [],
          recentUsers: [],
          topEngagedUsers: []
        }

  return (
    <S.ReportsUsersView>
      <ViewHeader>
        <h2>Relatórios de Usuários</h2>
        <DatePicker.RangePicker
          onChange={(dates) =>
            setDateRange(dates as [moment.Moment, moment.Moment])
          }
          format="DD/MM/YYYY"
          disabled={loading}
        />
      </ViewHeader>
      <S.ReportsUsersViewContent>
        {loading ? (
          <Spin size="large" style={{ margin: 'auto' }} />
        ) : (
          <>
            {/* Indicadores Principais */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total de Usuários"
                    value={filteredReportsData.totalUsers}
                    suffix="usuários"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Usuários Verificados"
                    value={filteredReportsData.verifiedUsersPercentage}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Média de Nível de Confiança"
                    value={filteredReportsData.trustLevelAverage}
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>

            {/* Gráficos */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Card title="Popularidade de Esportes">
                  <Pie
                    data={filteredReportsData.sportPopularity}
                    angleField="count"
                    colorField="name"
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
              <Col xs={24} md={12}>
                <Card title="Popularidade de Categorias Favoritas">
                  <Pie
                    data={filteredReportsData.categoryPopularity}
                    angleField="count"
                    colorField="name"
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

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Card title="Distribuição de Idades">
                  <Column
                    data={filteredReportsData.ageDistribution}
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
                <Card title="Distribuição por Estado">
                  <Column
                    data={filteredReportsData.stateDistribution}
                    xField="state"
                    yField="count"
                    label={{
                      position: 'middle',
                      style: { fill: '#FFFFFF', opacity: 0.6 }
                    }}
                    xAxis={{ label: { autoHide: true, autoRotate: true } }}
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
                    dataSource={filteredReportsData.recentUsers}
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
                <Card title="Usuários Mais Engajados (Nível de Confiança)">
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredReportsData.topEngagedUsers}
                    renderItem={(user) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={user.profilePicture || <UserOutlined />}
                            />
                          }
                          title={user.name}
                          description={`Nível de Confiança: ${
                            user.trustLevel
                          } | Verificado: ${user.isVerified ? 'Sim' : 'Não'}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </S.ReportsUsersViewContent>
    </S.ReportsUsersView>
  )
}

export default ReportsUsersView
