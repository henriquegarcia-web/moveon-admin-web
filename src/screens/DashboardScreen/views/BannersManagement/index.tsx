// src/screens/DashboardScreen/views/BannersManagementView/index.tsx

import { useState } from 'react'
import * as S from './styles'
import { LuTrash, LuSquarePen, LuEye, LuCopy } from 'react-icons/lu'
import {
  Button,
  Tag,
  Form,
  Select,
  Input,
  Upload,
  DatePicker,
  Switch,
  ConfigProvider
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ViewHeader, FormModal, ConfirmModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { Column } from '@ant-design/charts'
import { IBanner } from '@/types'
import moment from 'moment'
import { useBanners } from '@/contexts/BannersProvider'
import localeProvider from 'antd/locale/pt_BR'

// Schema de validação para banners
const bannerSchema = yup
  .object({
    title: yup
      .string()
      .required('O título é obrigatório')
      .max(100, 'O título deve ter no máximo 100 caracteres'),
    imageUrl: yup.string().required('A imagem é obrigatória'),
    position: yup
      .mixed<'home-top' | 'home-middle' | 'search-side' | 'other'>()
      .oneOf(
        ['home-top', 'home-middle', 'search-side', 'other'],
        'Posição inválida'
      )
      .required('A posição é obrigatória'),
    link: yup.string().url('URL inválida').optional(),
    startDate: yup.string().required('A data de início é obrigatória'),
    endDate: yup
      .string()
      .nullable()
      .optional()
      .test(
        'is-after-start',
        'A data de fim deve ser posterior à data de início',
        function (value) {
          if (!value) return true
          const startDate = this.parent.startDate
          return moment(value).isAfter(moment(startDate))
        }
      ),
    status: yup
      .mixed<'active' | 'inactive' | 'scheduled'>()
      .oneOf(['active', 'inactive', 'scheduled'], 'Status inválido')
      .required('O status é obrigatório'),
    priority: yup
      .number()
      .required('A prioridade é obrigatória')
      .min(1, 'A prioridade deve ser entre 1 e 100')
      .max(100, 'A prioridade deve ser entre 1 e 100')
  })
  .required()

type BannerFormData = {
  title: string
  imageUrl: string
  position: 'home-top' | 'home-middle' | 'search-side' | 'other'
  link?: string
  startDate: string
  endDate?: string | null
  status: 'active' | 'inactive' | 'scheduled'
  priority: number
}

const BannersManagementView = () => {
  const {
    banners,
    loading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    uploadBannerImage,
    getPerformanceData
  } = useBanners()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null)

  // Configuração do formulário
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue
  } = useForm<BannerFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(bannerSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      position: 'home-top',
      link: '',
      startDate: moment().toISOString(),
      endDate: null,
      status: 'inactive',
      priority: 1
    }
  })

  // Filtragem dos banners
  const filteredBanners = banners.filter(
    (banner) =>
      (statusFilter === 'all' || banner.status === statusFilter) &&
      (banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.id.includes(searchTerm.toLowerCase()))
  )

  // Colunas da tabela
  const columns: TableColumn<IBanner>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Imagem',
      key: 'imageUrl',
      render: (_, record) => (
        <S.ImageThumbnail src={record.imageUrl} alt={record.title} />
      )
    },
    {
      title: 'Posição',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag
          color={
            record.status === 'active'
              ? 'green'
              : record.status === 'scheduled'
              ? 'blue'
              : 'gray'
          }
        >
          {record.status === 'active'
            ? 'Ativo'
            : record.status === 'scheduled'
            ? 'Agendado'
            : 'Inativo'}
        </Tag>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <S.ActionButtons>
          <Button
            icon={<LuTrash />}
            danger
            onClick={() => {
              setSelectedBanner(record)
              setDeleteModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuSquarePen />}
            onClick={() => {
              setSelectedBanner(record)
              setEditModalVisible(true)
              reset({
                ...record,
                startDate: record.startDate,
                endDate: record.endDate || null
              })
            }}
            size="small"
          />
          <Button
            icon={<LuEye />}
            onClick={() => {
              setSelectedBanner(record)
              setDetailsModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuCopy />}
            onClick={() => {
              const duplicatedBanner = {
                ...record,
                title: `${record.title} (Cópia)`,
                id: undefined
              }
              createBanner(duplicatedBanner)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Submissão do formulário de criação
  const onCreateBannerSubmit = async (data: BannerFormData) => {
    const formattedData = {
      ...data,
      endDate: data.endDate || undefined
    }
    await createBanner(formattedData)
    setCreateModalVisible(false)
    reset()
  }

  // Submissão do formulário de edição
  const onEditBannerSubmit = async (data: BannerFormData) => {
    if (selectedBanner) {
      const formattedData = {
        ...data,
        endDate: data.endDate || undefined
      }
      await updateBanner(selectedBanner.id, formattedData)
      setEditModalVisible(false)
      reset()
    }
  }

  // Confirmação de exclusão
  const handleDeleteBanner = async () => {
    if (selectedBanner) {
      await deleteBanner(selectedBanner.id)
      setDeleteModalVisible(false)
      setSelectedBanner(null)
    }
  }

  // Campos para o DetailsForm
  const bannerDetailsFields = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Título' },
    {
      key: 'imageUrl',
      label: 'Imagem',
      render: (value: string) => <S.ImagePreview src={value} alt="Banner" />
    },
    { key: 'position', label: 'Posição' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Tag
          color={
            value === 'active'
              ? 'green'
              : value === 'scheduled'
              ? 'blue'
              : 'gray'
          }
        >
          {value === 'active'
            ? 'Ativo'
            : value === 'scheduled'
            ? 'Agendado'
            : 'Inativo'}
        </Tag>
      )
    },
    { key: 'link', label: 'Link', render: (value: string) => value || '-' },
    {
      key: 'startDate',
      label: 'Início',
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm')
    },
    {
      key: 'endDate',
      label: 'Fim',
      render: (value: string | undefined) =>
        value ? moment(value).format('DD/MM/YYYY HH:mm') : '-'
    },
    { key: 'priority', label: 'Prioridade' },
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

  // Dados de performance para gráfico
  const performanceData = selectedBanner
    ? getPerformanceData(selectedBanner.id)
    : []
  const chartConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'clicks',
    title: { visible: true, text: 'Cliques por Dia' }
  }

  return (
    <S.BannersManagementView>
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
          style={{ width: 150, marginRight: 'auto' }}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativo' },
            { value: 'inactive', label: 'Inativo' },
            { value: 'scheduled', label: 'Agendado' }
          ]}
        />
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Criar Banner
        </Button>
      </ViewHeader>
      <S.BannersManagementViewContent>
        <Table<IBanner>
          columns={columns}
          dataSource={filteredBanners}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </S.BannersManagementViewContent>

      {/* Modal de Criação */}
      <FormModal<BannerFormData>
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Criar Novo Banner"
        formMethods={
          { control, handleSubmit, formState: { errors, isSubmitting } } as any
        }
      >
        <S.BannerForm
          onFinish={handleSubmit(onCreateBannerSubmit)}
          layout="vertical"
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Título"
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
              >
                <Input {...field} placeholder="Ex.: Promoção de Chuteiras" />
              </Form.Item>
            )}
          />
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Imagem"
                validateStatus={errors.imageUrl ? 'error' : ''}
                help={errors.imageUrl?.message}
              >
                <Upload
                  accept=".jpg,.png"
                  beforeUpload={(file) => {
                    uploadBannerImage(file).then((url) =>
                      setValue('imageUrl', url)
                    )
                    return false // Impede upload automático
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
                </Upload>
                {field.value && (
                  <S.ImagePreview src={field.value} alt="Pré-visualização" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Posição"
                validateStatus={errors.position ? 'error' : ''}
                help={errors.position?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'home-top', label: 'Home - Topo' },
                    { value: 'home-middle', label: 'Home - Meio' },
                    { value: 'search-side', label: 'Pesquisa' },
                    { value: 'other', label: 'Outro' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link (opcional)"
                validateStatus={errors.link ? 'error' : ''}
                help={errors.link?.message}
              >
                <Input {...field} placeholder="Ex.: https://site.com/promo" />
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
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Data de Fim (opcional)"
                validateStatus={errors.endDate ? 'error' : ''}
                help={errors.endDate?.message}
              >
                <ConfigProvider locale={localeProvider}>
                  <DatePicker
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    value={field.value ? moment(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : null)
                    }
                  />
                </ConfigProvider>
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
                <Select
                  {...field}
                  options={[
                    { value: 'active', label: 'Ativo' },
                    { value: 'inactive', label: 'Inativo' },
                    { value: 'scheduled', label: 'Agendado' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Prioridade (1-100)"
                validateStatus={errors.priority ? 'error' : ''}
                help={errors.priority?.message}
              >
                <Input {...field} type="number" min={1} max={100} />
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
        </S.BannerForm>
      </FormModal>

      {/* Modal de Edição */}
      <FormModal<BannerFormData>
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Editar Banner"
        formMethods={
          { control, handleSubmit, formState: { errors, isSubmitting } } as any
        }
      >
        <S.BannerForm
          onFinish={handleSubmit(onEditBannerSubmit)}
          layout="vertical"
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Título"
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
              >
                <Input {...field} />
              </Form.Item>
            )}
          />
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Imagem"
                validateStatus={errors.imageUrl ? 'error' : ''}
                help={errors.imageUrl?.message}
              >
                <Upload
                  accept=".jpg,.png"
                  beforeUpload={(file) => {
                    uploadBannerImage(file).then((url) =>
                      setValue('imageUrl', url)
                    )
                    return false
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Alterar Imagem</Button>
                </Upload>
                {field.value && (
                  <S.ImagePreview src={field.value} alt="Pré-visualização" />
                )}
              </Form.Item>
            )}
          />
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Posição"
                validateStatus={errors.position ? 'error' : ''}
                help={errors.position?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'home-top', label: 'Home - Topo' },
                    { value: 'home-middle', label: 'Home - Meio' },
                    { value: 'search-side', label: 'Pesquisa - Lateral' },
                    { value: 'other', label: 'Outro' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Link (opcional)"
                validateStatus={errors.link ? 'error' : ''}
                help={errors.link?.message}
              >
                <Input {...field} />
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
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Data de Fim (opcional)"
                validateStatus={errors.endDate ? 'error' : ''}
                help={errors.endDate?.message}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  value={field.value ? moment(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : null)
                  }
                />
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
                <Select
                  {...field}
                  options={[
                    { value: 'active', label: 'Ativo' },
                    { value: 'inactive', label: 'Inativo' },
                    { value: 'scheduled', label: 'Agendado' }
                  ]}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Prioridade (1-100)"
                validateStatus={errors.priority ? 'error' : ''}
                help={errors.priority?.message}
              >
                <Input {...field} type="number" min={1} max={100} />
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
        </S.BannerForm>
      </FormModal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteBanner}
        onCancel={() => setDeleteModalVisible(false)}
        title="Confirmação de Exclusão"
        content="Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Visualização */}
      <FormModal<any>
        visible={isDetailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        title={`Detalhes do Banner: #${selectedBanner?.id}`}
        formMethods={{} as any}
      >
        {selectedBanner && (
          <>
            <DetailsForm
              data={selectedBanner}
              fields={bannerDetailsFields}
              column={1}
              bordered
            />
            <S.ChartContainer>
              <Column {...chartConfig} />
            </S.ChartContainer>
            <S.ModalFooter>
              <Button
                onClick={() =>
                  toggleBannerStatus(selectedBanner.id, selectedBanner.status)
                }
              >
                {selectedBanner.status === 'active' ? 'Desativar' : 'Ativar'}
              </Button>
              <Button onClick={() => setDetailsModalVisible(false)}>
                Fechar
              </Button>
            </S.ModalFooter>
          </>
        )}
      </FormModal>
    </S.BannersManagementView>
  )
}

export default BannersManagementView
