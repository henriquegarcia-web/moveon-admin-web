import { useState, useEffect } from 'react'
import * as S from './styles'
import { LuTrash, LuSquarePen, LuEye, LuPause, LuPlay } from 'react-icons/lu'
import { Button, Tag, Form, Select, Input, DatePicker } from 'antd'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ViewHeader, FormModal, ConfirmModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { Line } from '@ant-design/charts'
import { IAdvertisingCampaign, IAd } from '@/types'
import moment from 'moment'
import { useAdvertising } from '@/contexts/AdvertisingProvider'
import { ADVERTISING_STATUS_TYPES, ADVERTISING_TYPE_TYPES } from '@/data/admin'
import { SPORT_CATEGORIES_V1 } from '@/data/admin'
import { useAds } from '@/contexts/AdsProvider'

// Funções auxiliares para conversão de dados
const convertStatusToOptions = () =>
  ADVERTISING_STATUS_TYPES.map((status) => ({
    value: status.key,
    label: status.label
  }))

const convertSportsToOptions = () =>
  SPORT_CATEGORIES_V1.map((category) => ({
    value: category.name,
    label: category.name
  }))

const convertAdsToOptions = (ads: IAd[]) =>
  ads?.map((ad) => ({
    value: ad.id,
    label: ad.title
  }))

// Schema de validação para campanhas
const campaignSchema = yup
  .object({
    name: yup
      .string()
      .required('O título é obrigatório')
      .max(100, 'O título deve ter no máximo 100 caracteres'),
    bannerDesktop: yup
      .string()
      .required('O link do banner para desktop é obrigatório')
      .url('Deve ser uma URL válida'),
    bannerMobile: yup
      .string()
      .required('O link do banner para mobile é obrigatório')
      .url('Deve ser uma URL válida'),
    durationDays: yup
      .number()
      .required('O tempo de duração é obrigatório')
      .min(1, 'O tempo mínimo é 1 dia')
      .integer('Deve ser um número inteiro'),
    targetAudience: yup.object().shape({
      sports: yup
        .array()
        .of(yup.string().required('Esporte inválido'))
        .nullable()
        .transform((value) =>
          value ? value.filter((v: string | undefined) => v != null) : null
        )
        .optional(),
      location: yup.string().optional(),
      ageRange: yup
        .array()
        .of(yup.number().required('Idade deve ser um número'))
        .length(2, 'Faixa etária deve ter início e fim')
        .test(
          'age-range-order',
          'A idade inicial deve ser menor que a final',
          function (value) {
            if (!value || value[0] == null || value[1] == null) return true
            return value[0] < value[1]
          }
        )
        .nullable()
        .optional()
    }),
    budget: yup.object().shape({
      total: yup
        .number()
        .required('O orçamento total é obrigatório')
        .min(1, 'O orçamento deve ser maior que 0'),
      model: yup
        .string()
        .oneOf(['cpc', 'cpm'], 'Modelo inválido')
        .required('O modelo de orçamento é obrigatório'),
      value: yup
        .number()
        .required('O valor por clique/impressão é obrigatório')
        .min(0.1, 'O valor deve ser maior que 0.1')
    }),
    status: yup
      .string()
      .oneOf(
        ADVERTISING_STATUS_TYPES.map((s) => s.key),
        'Status inválido'
      )
      .required('O status é obrigatório'),
    startDate: yup.string().required('A data de início é obrigatória')
  })
  .required()

type CampaignFormData = {
  name: string // Agora representa o título do anúncio
  bannerDesktop: string
  bannerMobile: string
  durationDays: number
  targetAudience: {
    sports?: string[] | null
    location?: string
    ageRange?: number[] | null | undefined
  }
  budget: {
    total: number
    model: 'cpc' | 'cpm'
    value: number
  }
  status: 'active' | 'paused' | 'scheduled' | 'finished'
  startDate: string
  // endDate será calculado com base em startDate + durationDays
}

interface IAdvertisingManagementView {}

const AdvertisingManagementView = ({}: IAdvertisingManagementView) => {
  const {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
    getFormattedCampaignMetrics,
    getAdvertisingStatusDetail,
    getAdvertisingTypeDetail
  } = useAdvertising()
  const { ads } = useAds()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedCampaign, setSelectedCampaign] =
    useState<IAdvertisingCampaign | null>(null)
  const [metricsData, setMetricsData] = useState<
    { date: string; value: number; type: 'impressions' | 'clicks' }[]
  >([])

  // Configuração do formulário
  const formMethods = useForm<CampaignFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(campaignSchema),
    defaultValues: {
      name: '',
      bannerDesktop: '',
      bannerMobile: '',
      durationDays: 30,
      targetAudience: { sports: null, location: '', ageRange: undefined },
      budget: { total: 0, model: 'cpc', value: 0.5 },
      status: 'scheduled',
      startDate: moment().toISOString()
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue
  } = formMethods

  // Observa os valores dos campos para pré-visualização
  const formName = watch('name')
  const bannerDesktop = watch('bannerDesktop')
  const bannerMobile = watch('bannerMobile')
  const startDate = watch('startDate')
  const durationDays = watch('durationDays')

  // Calcula endDate com base em startDate e durationDays
  const endDate =
    startDate && durationDays
      ? moment(startDate).add(durationDays, 'days').toISOString()
      : undefined

  // Filtragem das campanhas
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      (statusFilter === 'all' || campaign.status === statusFilter) &&
      (campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.id.includes(searchTerm.toLowerCase()))
  )

  // Colunas da tabela
  const columns: TableColumn<IAdvertisingCampaign>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: 'Título',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        const status = getAdvertisingStatusDetail(value)
        return (
          <Tag color={status?.color || 'gray'}>{status?.label || value}</Tag>
        )
      }
    },
    {
      title: 'Orçamento',
      dataIndex: 'budget',
      key: 'budget',
      render: (value) =>
        `R$ ${value.total.toFixed(2)} (${value.model.toUpperCase()})`
    },
    {
      title: 'Período',
      key: 'period',
      render: (_, record) =>
        `${moment(record.startDate).format('DD/MM/YYYY')} - ${moment(
          record.endDate
        ).format('DD/MM/YYYY')}`
    },
    {
      title: 'Cliques',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a, b) => a.clicks - b.clicks
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <S.ActionButtons>
          <Button
            icon={record.status === 'active' ? <LuPause /> : <LuPlay />}
            onClick={() => toggleCampaignStatus(record.id, record.status)}
            size="small"
            disabled={
              record.status === 'finished' || record.status === 'scheduled'
            }
          />
          <Button
            icon={<LuTrash />}
            danger
            onClick={() => {
              setSelectedCampaign(record)
              setDeleteModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuSquarePen />}
            onClick={() => {
              setSelectedCampaign(record)
              setEditModalVisible(true)
              reset({
                name: record.name,
                bannerDesktop: record.content.imageUrl || '',
                bannerMobile: record.content.imageUrl || '', // Ajustar conforme necessário
                durationDays: moment(record.endDate).diff(
                  moment(record.startDate),
                  'days'
                ),
                targetAudience: record.targetAudience,
                budget: record.budget,
                status: record.status,
                startDate: record.startDate
              })
            }}
            size="small"
          />
          <Button
            icon={<LuEye />}
            onClick={() => {
              setSelectedCampaign(record)
              setDetailsModalVisible(true)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Carregar métricas assincronamente quando selectedCampaign mudar
  useEffect(() => {
    const fetchMetrics = async () => {
      if (selectedCampaign) {
        const formattedMetrics = await getFormattedCampaignMetrics(
          selectedCampaign.id
        )
        setMetricsData(formattedMetrics)
      } else {
        setMetricsData([])
      }
    }

    fetchMetrics()
  }, [selectedCampaign, getFormattedCampaignMetrics])

  // Submissão do formulário de criação
  const onCreateCampaignSubmit = async (data: CampaignFormData) => {
    await createCampaign({
      ...data,
      endDate: endDate || '',
      targetAudience: {
        ...data.targetAudience,
        sports: data.targetAudience.sports || undefined,
        ageRange: data.targetAudience.ageRange || undefined
      },
      content: {
        imageUrl: data.bannerDesktop // Usar bannerDesktop como referência inicial
      }
    })
    setCreateModalVisible(false)
    reset()
  }

  // Submissão do formulário de edição
  const onEditCampaignSubmit = async (data: CampaignFormData) => {
    if (selectedCampaign) {
      await updateCampaign(selectedCampaign.id, {
        ...data,
        endDate: endDate || '',
        targetAudience: {
          ...data.targetAudience,
          sports: data.targetAudience.sports || undefined,
          ageRange: data.targetAudience.ageRange || undefined
        },
        content: {
          imageUrl: data.bannerDesktop // Usar bannerDesktop como referência inicial
        }
      })
      setEditModalVisible(false)
      reset()
    }
  }

  // Confirmação de exclusão
  const handleDeleteCampaign = async () => {
    if (selectedCampaign) {
      await deleteCampaign(selectedCampaign.id)
      setDeleteModalVisible(false)
      setSelectedCampaign(null)
    }
  }

  // Campos para o DetailsForm
  const campaignDetailsFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Título' },
    {
      key: 'content',
      label: 'Banners',
      render: (value: IAdvertisingCampaign['content']) => (
        <>
          {value.imageUrl && (
            <S.ImagePreview src={value.imageUrl} alt="Banner Desktop" />
          )}
          {/* Placeholder para banner mobile até integração completa */}
          <p>Mobile: {value.imageUrl || '-'}</p>
        </>
      )
    },
    {
      key: 'targetAudience',
      label: 'Público-Alvo',
      render: (value: IAdvertisingCampaign['targetAudience']) => {
        const parts: string[] = []
        if (value.sports?.length)
          parts.push(`Esportes: ${value.sports.join(', ')}`)
        if (value.location) parts.push(`Localização: ${value.location}`)
        if (value.ageRange)
          parts.push(`Idade: ${value.ageRange[0]}-${value.ageRange[1]}`)
        return parts.join(' | ') || '-'
      }
    },
    {
      key: 'budget',
      label: 'Orçamento',
      render: (value: IAdvertisingCampaign['budget']) =>
        `R$ ${value.total.toFixed(
          2
        )} (${value.model.toUpperCase()}: R$ ${value.value.toFixed(2)})`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const status = getAdvertisingStatusDetail(value)
        return (
          <Tag color={status?.color || 'gray'}>{status?.label || value}</Tag>
        )
      }
    },
    {
      key: 'startDate',
      label: 'Início',
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm')
    },
    {
      key: 'endDate',
      label: 'Fim',
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm')
    },
    { key: 'impressions', label: 'Impressões' },
    { key: 'clicks', label: 'Cliques' },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm')
    },
    {
      key: 'updatedAt',
      label: 'Atualizado em',
      render: (value: string | undefined) =>
        value ? moment(value).format('DD/MM/YYYY HH:mm') : '-'
    }
  ]

  // Configuração do gráfico
  const chartConfig = {
    data: metricsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    title: { visible: true, text: 'Impressões e Cliques por Dia' }
  }

  return (
    <S.AdvertisingManagementView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por título ou ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 260 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { value: 'all', label: 'Todos Status' },
            ...convertStatusToOptions()
          ]}
        />
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Criar Campanha
        </Button>
      </ViewHeader>
      <S.AdvertisingManagementViewContent>
        <Table<IAdvertisingCampaign>
          columns={columns}
          dataSource={filteredCampaigns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </S.AdvertisingManagementViewContent>

      {/* Modal de Criação */}
      <FormModal<CampaignFormData>
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Criar Nova Campanha"
        formMethods={formMethods}
      >
        <S.CampaignForm
          onFinish={handleSubmit(onCreateCampaignSubmit)}
          layout="vertical"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Título"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input {...field} placeholder="Ex.: Promoção de Chuteiras" />
              </Form.Item>
            )}
          />
          <Controller
            name="bannerDesktop"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link do Banner Desktop"
                validateStatus={errors.bannerDesktop ? 'error' : ''}
                help={errors.bannerDesktop?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: https://site.com/banner-desktop.jpg"
                />
                {bannerDesktop && (
                  <S.ImagePreview src={bannerDesktop} alt="Banner Desktop" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="bannerMobile"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link do Banner Mobile"
                validateStatus={errors.bannerMobile ? 'error' : ''}
                help={errors.bannerMobile?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: https://site.com/banner-mobile.jpg"
                />
                {bannerMobile && (
                  <S.ImagePreview src={bannerMobile} alt="Banner Mobile" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="durationDays"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Duração (dias)"
                validateStatus={errors.durationDays ? 'error' : ''}
                help={errors.durationDays?.message}
              >
                <Input {...field} type="number" min={1} />
              </Form.Item>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Data de Início"
                validateStatus={errors.startDate ? 'error' : ''}
                help={errors.startDate?.message}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  value={field.value ? moment(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                />
              </Form.Item>
            )}
          />
          <Form.Item
            label="Data de Fim"
            help={
              endDate
                ? moment(endDate).format('DD/MM/YYYY HH:mm')
                : 'Não calculada'
            }
          >
            {/* Campo de exibição apenas */}
          </Form.Item>
          <Controller
            name="targetAudience.sports"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Esportes Favoritos (opcional)"
                validateStatus={errors.targetAudience?.sports ? 'error' : ''}
                help={errors.targetAudience?.sports?.message}
              >
                <Select
                  {...field}
                  mode="multiple"
                  placeholder="Selecione os esportes"
                  options={convertSportsToOptions()}
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value || null)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="targetAudience.location"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Localização (opcional)"
                validateStatus={errors.targetAudience?.location ? 'error' : ''}
                help={errors.targetAudience?.location?.message}
              >
                <Input {...field} placeholder="Ex.: São Paulo - SP" />
              </Form.Item>
            )}
          />
          <Controller
            name="targetAudience.ageRange"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Faixa Etária (opcional)"
                validateStatus={errors.targetAudience?.ageRange ? 'error' : ''}
                help={errors.targetAudience?.ageRange?.message}
              >
                <Input
                  value={
                    field.value ? `${field.value[0]}-${field.value[1]}` : ''
                  }
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('-').map(Number)
                    field.onChange([start || 18, end || 35])
                  }}
                  placeholder="Ex.: 18-35"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.total"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Orçamento Total (R$)"
                validateStatus={errors.budget?.total ? 'error' : ''}
                help={errors.budget?.total?.message}
              >
                <Input {...field} type="number" min={0} step={0.01} />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.model"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Modelo de Orçamento"
                validateStatus={errors.budget?.model ? 'error' : ''}
                help={errors.budget?.model?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'cpc', label: 'CPC (Custo por Clique)' },
                    { value: 'cpm', label: 'CPM (Custo por Mil Impressões)' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.value"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Valor (R$)"
                validateStatus={errors.budget?.value ? 'error' : ''}
                help={errors.budget?.value?.message}
              >
                <Input {...field} type="number" min={0.1} step={0.01} />
              </Form.Item>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Status"
                validateStatus={errors.status ? 'error' : ''}
                help={errors.status?.message}
              >
                <Select {...field} options={convertStatusToOptions()} />
              </Form.Item>
            )}
          />
          <S.ModalFooter>
            <Button onClick={() => setCreateModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Criar
            </Button>
          </S.ModalFooter>
        </S.CampaignForm>
      </FormModal>

      {/* Modal de Edição */}
      <FormModal<CampaignFormData>
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Editar Campanha"
        formMethods={formMethods}
      >
        <S.CampaignForm
          onFinish={handleSubmit(onEditCampaignSubmit)}
          layout="vertical"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Título"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input {...field} />
              </Form.Item>
            )}
          />
          <Controller
            name="bannerDesktop"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link do Banner Desktop"
                validateStatus={errors.bannerDesktop ? 'error' : ''}
                help={errors.bannerDesktop?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: https://site.com/banner-desktop.jpg"
                />
                {bannerDesktop && (
                  <S.ImagePreview src={bannerDesktop} alt="Banner Desktop" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="bannerMobile"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link do Banner Mobile"
                validateStatus={errors.bannerMobile ? 'error' : ''}
                help={errors.bannerMobile?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: https://site.com/banner-mobile.jpg"
                />
                {bannerMobile && (
                  <S.ImagePreview src={bannerMobile} alt="Banner Mobile" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="durationDays"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Duração (dias)"
                validateStatus={errors.durationDays ? 'error' : ''}
                help={errors.durationDays?.message}
              >
                <Input {...field} type="number" min={1} />
              </Form.Item>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Data de Início"
                validateStatus={errors.startDate ? 'error' : ''}
                help={errors.startDate?.message}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  value={field.value ? moment(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                />
              </Form.Item>
            )}
          />
          <Form.Item
            label="Data de Fim"
            help={
              endDate
                ? moment(endDate).format('DD/MM/YYYY HH:mm')
                : 'Não calculada'
            }
          >
            {/* Campo de exibição apenas */}
          </Form.Item>
          <Controller
            name="targetAudience.sports"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Esportes Favoritos (opcional)"
                validateStatus={errors.targetAudience?.sports ? 'error' : ''}
                help={errors.targetAudience?.sports?.message}
              >
                <Select
                  {...field}
                  mode="multiple"
                  placeholder="Selecione os esportes"
                  options={convertSportsToOptions()}
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value || null)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="targetAudience.location"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Localização (opcional)"
                validateStatus={errors.targetAudience?.location ? 'error' : ''}
                help={errors.targetAudience?.location?.message}
              >
                <Input {...field} placeholder="Ex.: São Paulo - SP" />
              </Form.Item>
            )}
          />
          <Controller
            name="targetAudience.ageRange"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Faixa Etária (opcional)"
                validateStatus={errors.targetAudience?.ageRange ? 'error' : ''}
                help={errors.targetAudience?.ageRange?.message}
              >
                <Input
                  value={
                    field.value ? `${field.value[0]}-${field.value[1]}` : ''
                  }
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('-').map(Number)
                    field.onChange([start || 18, end || 35])
                  }}
                  placeholder="Ex.: 18-35"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.total"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Orçamento Total (R$)"
                validateStatus={errors.budget?.total ? 'error' : ''}
                help={errors.budget?.total?.message}
              >
                <Input {...field} type="number" min={0} step={0.01} />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.model"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Modelo de Orçamento"
                validateStatus={errors.budget?.model ? 'error' : ''}
                help={errors.budget?.model?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'cpc', label: 'CPC (Custo por Clique)' },
                    { value: 'cpm', label: 'CPM (Custo por Mil Impressões)' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="budget.value"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Valor (R$)"
                validateStatus={errors.budget?.value ? 'error' : ''}
                help={errors.budget?.value?.message}
              >
                <Input {...field} type="number" min={0.1} step={0.01} />
              </Form.Item>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Status"
                validateStatus={errors.status ? 'error' : ''}
                help={errors.status?.message}
              >
                <Select {...field} options={convertStatusToOptions()} />
              </Form.Item>
            )}
          />
          <S.ModalFooter>
            <Button onClick={() => setEditModalVisible(false)}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Salvar
            </Button>
          </S.ModalFooter>
        </S.CampaignForm>
      </FormModal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteCampaign}
        onCancel={() => setDeleteModalVisible(false)}
        title="Confirmação de Exclusão"
        content="Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Visualização */}
      <FormModal
        visible={isDetailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        title={`Detalhes da Campanha: #${selectedCampaign?.id}`}
        formMethods={{} as UseFormReturn<any>}
      >
        {selectedCampaign && (
          <>
            <DetailsForm
              data={selectedCampaign}
              fields={campaignDetailsFields}
              column={1}
              bordered
            />
            <S.ChartContainer>
              <Line {...chartConfig} />
            </S.ChartContainer>
            <S.ModalFooter>
              <Button
                onClick={() =>
                  toggleCampaignStatus(
                    selectedCampaign.id,
                    selectedCampaign.status
                  )
                }
                disabled={
                  selectedCampaign.status === 'finished' ||
                  selectedCampaign.status === 'scheduled'
                }
              >
                {selectedCampaign.status === 'active' ? 'Pausar' : 'Retomar'}
              </Button>
              <Button onClick={() => setDetailsModalVisible(false)}>
                Fechar
              </Button>
            </S.ModalFooter>
          </>
        )}
      </FormModal>
    </S.AdvertisingManagementView>
  )
}

export default AdvertisingManagementView
