// src/components/ReportsAdsView/index.tsx

import * as S from './styles'
import { useReports } from '@/contexts/ReportsProvider'
import {
  Card,
  Statistic,
  Row,
  Col,
  List,
  Avatar,
  Spin,
  DatePicker,
  Select
} from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { ViewHeader } from '@/components'
import { Pie } from '@ant-design/charts'
import moment from 'moment'
import { useState } from 'react'
import { AdStatusType } from '@/types'
import { ADS_STATUS_TYPES, AdStatus } from '@/data/admin'

interface IReportsAdsView {}

const ReportsAdsView = ({}: IReportsAdsView) => {
  const { reportsData, loading } = useReports()
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null)
  const [statusFilter, setStatusFilter] = useState<AdStatusType | 'all'>('all')

  // Filtrar anúncios com base no intervalo de datas e status
  const filteredAds =
    !loading && reportsData.ads.length > 0
      ? reportsData.ads.filter((ad) => {
          const dateMatch = dateRange
            ? moment(ad.createdAt).isBetween(
                dateRange[0],
                dateRange[1],
                undefined,
                '[]'
              )
            : true
          const statusMatch =
            statusFilter === 'all' || ad.status === statusFilter
          return dateMatch && statusMatch
        })
      : []

  // Calcular filteredReportsData apenas se houver dados
  const filteredReportsData =
    !loading && reportsData.ads.length > 0
      ? {
          ...reportsData,
          totalAds: filteredAds.length,
          approvedAdsPercentage: (() => {
            const approved = filteredAds.filter(
              (ad) => ad.status === 'approved'
            ).length
            return filteredAds.length > 0
              ? (approved / filteredAds.length) * 100
              : 0
          })(),
          averageAdPrice: (() => {
            const totalPrice = filteredAds.reduce(
              (sum, ad) => sum + ad.price,
              0
            )
            return filteredAds.length > 0 ? totalPrice / filteredAds.length : 0
          })(),
          adStatusDistribution: reportsData.adStatusDistribution.map(
            (item) => ({
              ...item,
              count: filteredAds.filter((ad) => ad.status === item.status)
                .length
            })
          ),
          adConditionDistribution: reportsData.adConditionDistribution.map(
            (item) => ({
              ...item,
              count: filteredAds.filter((ad) => ad.condition === item.condition)
                .length
            })
          ),
          recentAds: filteredAds
            .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
            .slice(0, 5),
          mostExpensiveAds: filteredAds
            .sort((a, b) => b.price - a.price)
            .slice(0, 5)
        }
      : {
          ...reportsData,
          totalAds: 0,
          approvedAdsPercentage: 0,
          averageAdPrice: 0,
          adStatusDistribution: [],
          adConditionDistribution: [],
          recentAds: [],
          mostExpensiveAds: []
        }

  return (
    <S.ReportsAdsView>
      <ViewHeader>
        <h2>Relatórios de Anúncios</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 200 }}
            disabled={loading}
          >
            <Select.Option value="all">Todos os Status</Select.Option>
            {ADS_STATUS_TYPES.map((status: AdStatus) => (
              <Select.Option key={status.key} value={status.key}>
                {status.label}
              </Select.Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            onChange={(dates) =>
              setDateRange(dates as [moment.Moment, moment.Moment])
            }
            format="DD/MM/YYYY"
            disabled={loading}
          />
        </div>
      </ViewHeader>
      <S.ReportsAdsViewContent>
        {loading ? (
          <Spin size="large" style={{ margin: 'auto' }} />
        ) : (
          <>
            {/* Indicadores Principais */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total de Anúncios"
                    value={filteredReportsData.totalAds}
                    suffix="anúncios"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Anúncios Aprovados"
                    value={filteredReportsData.approvedAdsPercentage}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Preço Médio"
                    value={filteredReportsData.averageAdPrice}
                    precision={2}
                    prefix="R$"
                  />
                </Card>
              </Col>
            </Row>

            {/* Gráficos */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Card title="Distribuição por Status">
                  <Pie
                    data={filteredReportsData.adStatusDistribution}
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
              <Col xs={24} md={12}>
                <Card title="Distribuição por Condição">
                  <Pie
                    data={filteredReportsData.adConditionDistribution}
                    angleField="count"
                    colorField="condition"
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
                <Card title="Anúncios Recentes">
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredReportsData.recentAds}
                    renderItem={(ad) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<ShoppingOutlined />} />}
                          title={ad.title}
                          description={`Preço: R$${ad.price.toFixed(
                            2
                          )} | Status: ${ad.status} | Criado em: ${moment(
                            ad.createdAt
                          ).format('DD/MM/YYYY HH:mm')}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Anúncios Mais Caros">
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredReportsData.mostExpensiveAds}
                    renderItem={(ad) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<ShoppingOutlined />} />}
                          title={ad.title}
                          description={`Preço: R$${ad.price.toFixed(
                            2
                          )} | Status: ${ad.status} | Criado em: ${moment(
                            ad.createdAt
                          ).format('DD/MM/YYYY HH:mm')}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </S.ReportsAdsViewContent>
    </S.ReportsAdsView>
  )
}

export default ReportsAdsView
