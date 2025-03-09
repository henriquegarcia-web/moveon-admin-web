// src/screens/DashboardScreen/views/AdsListView/index.tsx
import { useState, useEffect } from 'react'
import * as S from './styles'
import { LuTrash, LuSquarePen, LuEye } from 'react-icons/lu'
import { Button, Tag, Form, Select, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ViewHeader, FormModal, ConfirmModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { AdStatusType, IAd, ProductConditionType } from '@/types'
import { useAds } from '@/contexts/AdsProvider'
import axios from 'axios'
import {
  SPORT_CATEGORIES_V1,
  Category,
  ADS_STATUS_TYPES,
  AdStatus,
  PRODUCT_CONDITION_TYPES,
  ProductCondition
} from '@/data/admin'
import { formatDateTime } from '@/utils/functions/convertTimestamp'

// Funções auxiliares para conversão de dados
const convertCategoriesToOptions = (categories: Category[]) => {
  const options: { value: string; label: string; disabled?: boolean }[] = []
  categories.forEach((category) => {
    options.push({
      value: category.id,
      label: category.name,
      disabled: true
    })
    category.subcategories.forEach((subcategory) => {
      options.push({
        value: subcategory.id,
        label: `  ${subcategory.name}`,
        disabled: false
      })
    })
  })
  return options
}

const convertStatusToOptions = (statuses: AdStatus[]) =>
  statuses.map((status) => ({
    value: status.key,
    label: status.label
  }))

const convertConditionsToOptions = (conditions: ProductCondition[]) =>
  conditions.map((condition) => ({
    value: condition.key,
    label: condition.label
  }))

// Schema de validação ajustado de forma escalável
const adSchema = yup
  .object({
    title: yup
      .string()
      .required('O título é obrigatório')
      .max(70, 'O título deve ter no máximo 70 caracteres'),
    description: yup
      .string()
      .required('A descrição é obrigatória')
      .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    price: yup
      .number()
      .required('O preço é obrigatório')
      .min(1, 'O preço deve ser maior que 0')
      .typeError('Digite um valor numérico válido'),
    categoryId: yup.string().required('Selecione uma subcategoria'),
    condition: yup
      .string()
      .oneOf(
        PRODUCT_CONDITION_TYPES.map((c) => c.key),
        'Selecione uma condição válida'
      )
      .required('Selecione a condição do item'),
    location: yup.object().shape({
      cep: yup
        .string()
        .required('O CEP é obrigatório')
        .matches(/^\d{5}-?\d{3}$/, 'CEP inválido'),
      address: yup.string()
    }),
    phone: yup
      .string()
      .required('O telefone é obrigatório')
      .matches(/^\d{11}$/, 'O telefone deve ter 11 dígitos (DDD + número)'),
    status: yup
      .string()
      .oneOf(
        ADS_STATUS_TYPES.map((s) => s.key),
        'Selecione um status válido'
      )
      .required('Status é obrigatório')
  })
  .required()

type AdFormData = {
  title: string
  description: string
  price: number
  categoryId: string
  condition: ProductConditionType
  location: {
    cep: string
    address?: string
  }
  phone: string
  status: AdStatusType
}

const AdsListView = () => {
  const {
    ads,
    loading,
    createAd,
    updateAd,
    deleteAd,
    formatCep,
    formatPhone,
    formatPrice,
    getCategoryDatail,
    getConditionDatail,
    getStatusDatail
  } = useAds()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdStatusType | 'all'>('all')
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null)

  // Configuração do formulário
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch
  } = useForm<AdFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      condition: 'new',
      location: { cep: '', address: '' },
      phone: '',
      status: 'draft'
    }
  })

  // Busca automática de endereço por CEP usando ViaCEP
  const cepValue = watch('location.cep')
  useEffect(() => {
    const fetchAddressFromCep = async (cep: string) => {
      if (cep && cep.match(/^\d{5}-?\d{3}$/)) {
        try {
          const response = await axios.get(
            `https://viacep.com.br/ws/${cep.replace('-', '')}/json/`
          )
          if (!response.data.erro) {
            setValue(
              'location.address',
              `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`
            )
          }
        } catch (error) {
          // Erro tratado no contexto
        }
      }
    }
    fetchAddressFromCep(cepValue)
  }, [cepValue, setValue])

  // Filtragem dos anúncios
  const filteredAds = ads.filter(
    (ad) =>
      (statusFilter === 'all' || ad.status === statusFilter) &&
      (ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Colunas da tabela
  const columns: TableColumn<IAd>[] = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatPrice(value)
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = ADS_STATUS_TYPES.find((s) => s.key === record.status)
        return (
          <Tag color={status?.color || 'gray'}>
            {status?.label || record.status}
          </Tag>
        )
      }
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
              setSelectedAd(record)
              setDeleteModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuSquarePen />}
            onClick={() => {
              setSelectedAd(record)
              setEditModalVisible(true)
              reset({
                ...record,
                price: record.price ?? 0,
                location: {
                  cep: formatCep(record.location.cep),
                  address: record.location.address
                },
                phone: formatPhone(record.phone)
              })
            }}
            size="small"
          />
          <Button
            icon={<LuEye />}
            onClick={() => {
              setSelectedAd(record)
              setDetailsModalVisible(true)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Submissão do formulário com upload para Firebase
  const onCreateAdSubmit = async (data: AdFormData) => {
    await createAd(data)
    setCreateModalVisible(false)
    reset()
  }

  // Submissão do formulário de edição
  const onEditAdSubmit = async (data: AdFormData) => {
    if (selectedAd) {
      await updateAd(selectedAd.id, data)
      setEditModalVisible(false)
      reset()
    }
  }

  // Confirmação de exclusão
  const handleDeleteAd = async () => {
    if (selectedAd) {
      await deleteAd(selectedAd.id)
      setDeleteModalVisible(false)
      setSelectedAd(null)
    }
  }

  // Função para comparar os valores do formulário com os dados originais
  const formValues = watch()
  const hasChanges = () => {
    if (!selectedAd) return false
    const originalData: AdFormData = {
      title: selectedAd.title,
      description: selectedAd.description,
      price: selectedAd.price ?? 0,
      categoryId: selectedAd.categoryId,
      condition: selectedAd.condition,
      location: {
        cep: selectedAd.location.cep,
        address: selectedAd.location.address
      },
      phone: selectedAd.phone,
      status: selectedAd.status
    }

    return (
      formValues.title !== originalData.title ||
      formValues.description !== originalData.description ||
      formValues.price !== originalData.price ||
      formValues.categoryId !== originalData.categoryId ||
      formValues.condition !== originalData.condition ||
      formValues.location.cep !== formatCep(originalData.location.cep) ||
      formValues.location.address !== originalData.location.address ||
      formValues.phone !== originalData.phone ||
      formValues.status !== originalData.status
    )
  }

  // Campos para o DetailsForm com tags para categoria e condição
  const adDetailsFields = [
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'price',
      label: 'Preço',
      render: (value: number) => formatPrice(value)
    },
    {
      key: 'categoryId',
      label: 'Categoria',
      render: (value: string) => <Tag>{getCategoryDatail(value)?.name}</Tag>
    },
    {
      key: 'condition',
      label: 'Condição',
      render: (value: string) => <Tag>{getConditionDatail(value)?.label}</Tag>
    },
    {
      key: 'location',
      label: 'CEP',
      render: (value: IAd['location']) => formatCep(value.cep)
    },
    {
      key: 'location',
      label: 'Endereço',
      render: (value: IAd['location']) => value.address || ''
    },
    {
      key: 'phone',
      label: 'Telefone',
      render: (value: string) => formatPhone(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Tag color={getStatusDatail(value)?.color}>
          {getStatusDatail(value)?.label}
        </Tag>
      )
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: string) => formatDateTime(value)
    },
    {
      key: 'updatedAt',
      label: 'Atualizado em',
      render: (value: string) => formatDateTime(value)
    }
  ]

  return (
    <S.AdsListView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por título ou descrição"
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
            ...convertStatusToOptions(ADS_STATUS_TYPES)
          ]}
        />
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Criar Anúncio
        </Button>
      </ViewHeader>
      <S.AdsListViewContent>
        <Table<IAd>
          columns={columns}
          dataSource={filteredAds}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </S.AdsListViewContent>

      {/* Modal de Criação */}
      <FormModal<AdFormData>
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Criar Novo Anúncio"
        formMethods={
          { control, handleSubmit, formState: { errors, isSubmitting } } as any
        }
      >
        <S.AdForm onFinish={handleSubmit(onCreateAdSubmit)} layout="vertical">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Título"
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
              >
                <Input {...field} placeholder="Ex.: Bicicleta Caloi Aro 29" />
              </Form.Item>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Descrição"
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description?.message}
              >
                <Input.TextArea
                  {...field}
                  placeholder="Ex.: Bicicleta em ótimo estado, usada por 6 meses"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Preço (R$)"
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price?.message}
              >
                <Input
                  {...field}
                  value={field.value ? formatPrice(field.value) : ''}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^\d,]/g, '')
                      .replace(',', '.')
                    field.onChange(parseFloat(value) || 0)
                  }}
                  inputMode="numeric"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Categoria"
                validateStatus={errors.categoryId ? 'error' : ''}
                help={errors.categoryId?.message}
              >
                <Select
                  {...field}
                  placeholder="Selecione uma subcategoria"
                  options={convertCategoriesToOptions(SPORT_CATEGORIES_V1)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Condição"
                validateStatus={errors.condition ? 'error' : ''}
                help={errors.condition?.message}
              >
                <Select
                  {...field}
                  placeholder="Selecione a condição"
                  options={convertConditionsToOptions(PRODUCT_CONDITION_TYPES)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="location.cep"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="CEP"
                validateStatus={errors.location?.cep ? 'error' : ''}
                help={errors.location?.cep?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: 12345-678"
                  maxLength={9}
                  value={formatCep(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="numeric"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="location.address"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Endereço"
                validateStatus={errors.location?.address ? 'error' : ''}
                help={errors.location?.address?.message}
              >
                <Input {...field} disabled />
              </Form.Item>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Telefone"
                validateStatus={errors.phone ? 'error' : ''}
                help={errors.phone?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: (11) 98765-4321"
                  maxLength={15}
                  value={formatPhone(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="tel"
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
                  placeholder="Selecione o status"
                  options={convertStatusToOptions(ADS_STATUS_TYPES)}
                />
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
        </S.AdForm>
      </FormModal>

      {/* Modal de Edição */}
      <FormModal<AdFormData>
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        title={`Editar Anúncio: #${selectedAd?.id}`}
        formMethods={
          { control, handleSubmit, formState: { errors, isSubmitting } } as any
        }
      >
        <S.AdForm onFinish={handleSubmit(onEditAdSubmit)} layout="vertical">
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
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Descrição"
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description?.message}
              >
                <Input.TextArea {...field} />
              </Form.Item>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Preço"
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price?.message}
              >
                <Input
                  {...field}
                  value={formatPrice(field.value)}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^\d,]/g, '')
                      .replace(',', '.')
                    field.onChange(parseFloat(value) || 0)
                  }}
                  inputMode="numeric"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Categoria"
                validateStatus={errors.categoryId ? 'error' : ''}
                help={errors.categoryId?.message}
              >
                <Select
                  {...field}
                  options={convertCategoriesToOptions(SPORT_CATEGORIES_V1)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Condição"
                validateStatus={errors.condition ? 'error' : ''}
                help={errors.condition?.message}
              >
                <Select
                  {...field}
                  options={convertConditionsToOptions(PRODUCT_CONDITION_TYPES)}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="location.cep"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="CEP"
                validateStatus={errors.location?.cep ? 'error' : ''}
                help={errors.location?.cep?.message}
              >
                <Input
                  {...field}
                  placeholder="Ex.: 12345-678"
                  maxLength={9}
                  value={formatCep(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="numeric"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="location.address"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Endereço"
                validateStatus={errors.location?.address ? 'error' : ''}
                help={errors.location?.address?.message}
              >
                <Input {...field} disabled />
              </Form.Item>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Telefone"
                validateStatus={errors.phone ? 'error' : ''}
                help={errors.phone?.message}
              >
                <Input
                  {...field}
                  value={formatPhone(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="tel"
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
                  options={convertStatusToOptions(ADS_STATUS_TYPES)}
                />
              </Form.Item>
            )}
          />
          <S.ModalFooter>
            <Button onClick={() => setEditModalVisible(false)}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid || !hasChanges()} // Ajustado para usar hasChanges()
              loading={isSubmitting}
            >
              Salvar
            </Button>
          </S.ModalFooter>
        </S.AdForm>
      </FormModal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteAd}
        onCancel={() => setDeleteModalVisible(false)}
        title="Confirmação de Exclusão"
        content="Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Visualização */}
      <FormModal<any>
        visible={isDetailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        title={`Detalhes do Anúncio: #${selectedAd?.id}`}
        formMethods={{} as any}
      >
        {selectedAd && (
          <>
            <DetailsForm
              data={selectedAd}
              fields={adDetailsFields}
              column={1}
              bordered
            />
            <S.ModalFooter>
              <Button onClick={() => setDetailsModalVisible(false)}>
                Fechar
              </Button>
            </S.ModalFooter>
          </>
        )}
      </FormModal>
    </S.AdsListView>
  )
}

export default AdsListView
