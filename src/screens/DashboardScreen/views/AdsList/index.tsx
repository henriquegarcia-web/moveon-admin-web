// src/screens/DashboardScreen/views/AdsListView/index.tsx
import { useState, useEffect } from 'react'
import * as S from './styles'
import { LuTrash, LuSquarePen, LuEye, LuPlus } from 'react-icons/lu'
import { Button, Tag, Form, Select, Input, Upload, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ViewHeader, FormModal, ConfirmModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { IAd, AdStatus } from '@/types'
import {
  beforeUploadImage,
  beforeUploadVideo,
  uploadFileToFirebase,
  getBase64
} from '@/utils/functions/uploadUtils'
import { PiSpinnerGap } from 'react-icons/pi'
import axios from 'axios'
import { useAds } from '@/contexts/AdsProvider'

// Schema de validação ajustado com base no mobile
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
    categoryId: yup.string().required('Selecione uma categoria'),
    condition: yup
      .string()
      .oneOf(['new', 'semi_new', 'used'], 'Selecione uma condição válida')
      .required('Selecione a condição do item'),
    location: yup.object().shape({
      cep: yup
        .string()
        .required('O CEP é obrigatório')
        .matches(/^\d{5}-?\d{3}$/, 'CEP inválido'),
      address: yup.string().required('O endereço é obrigatório')
    }),
    photos: yup
      .array()
      .of(yup.string())
      .min(1, 'Adicione pelo menos uma foto')
      .max(6, 'Máximo de 6 fotos permitido')
      .required('Adicione pelo menos uma foto'),
    video: yup.string().optional(),
    status: yup
      .string()
      .oneOf(['pending', 'published', 'editing', 'rejected', 'sold', 'removed'])
      .required('Status é obrigatório')
  })
  .required()

type AdFormData = yup.InferType<typeof adSchema>

const AdsListView = () => {
  const { ads, loading, createAd, updateAd, deleteAd } = useAds()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdStatus | 'all'>('all')
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)

  // Configuração do formulário
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch
  } = useForm<AdFormData>({
    resolver: yupResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      categoryId: '',
      condition: 'new',
      location: { cep: '', address: '' },
      photos: [],
      video: '',
      status: 'pending'
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
          } else {
            message.error('CEP inválido.')
          }
        } catch (error) {
          message.error('Erro ao buscar o CEP.')
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
      render: (value) => `R$ ${value.toFixed(2)}`
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag
          color={
            record.status === 'published'
              ? 'green'
              : record.status === 'pending'
              ? 'orange'
              : 'red'
          }
        >
          {record.status}
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
              reset(record)
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

  // Handlers de upload
  const handleImageChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const file = info.file.originFileObj as File
      const url = await uploadFileToFirebase(
        file,
        `ads/images/${Date.now()}_${file.name}`
      )
      setValue('photos', [...(control._formValues.photos || []), url], {
        shouldValidate: true
      })
      setImageLoading(false)
      message.success('Imagem carregada com sucesso!')
    }
  }

  const handleVideoChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setVideoLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const file = info.file.originFileObj as File
      const url = await uploadFileToFirebase(
        file,
        `ads/videos/${Date.now()}_${file.name}`
      )
      setValue('video', url, { shouldValidate: true })
      setVideoLoading(false)
      message.success('Vídeo carregado com sucesso!')
    }
  }

  const uploadButton = (loading: boolean) => (
    <S.AdsUpload>
      <S.AdsUploadLoading loading={loading ? 1 : 0}>
        {loading ? <PiSpinnerGap /> : <LuPlus />}
      </S.AdsUploadLoading>
      <p>Upload</p>
    </S.AdsUpload>
  )

  // Submissão do formulário de criação
  const onCreateAdSubmit = async (data: AdFormData) => {
    await createAd({
      ...data,
      photos: data.photos.filter((photo) => photo !== undefined) as string[]
    })
    setCreateModalVisible(false)
    reset()
  }

  // Submissão do formulário de edição
  const onEditAdSubmit = async (data: AdFormData) => {
    if (selectedAd) {
      await updateAd(selectedAd.id, {
        ...data,
        photos: data.photos.filter((photo) => photo !== undefined)
      })
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

  // Campos para o DetailsForm
  const adDetailsFields = [
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'price',
      label: 'Preço',
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    { key: 'categoryId', label: 'Categoria' },
    { key: 'condition', label: 'Condição' },
    {
      key: 'location',
      label: 'CEP',
      render: (value: IAd['location']) => value.cep
    },
    {
      key: 'location',
      label: 'Endereço',
      render: (value: IAd['location']) => value.address
    },
    {
      key: 'photos',
      label: 'Fotos',
      render: (value: string[]) => value.join(', ')
    },
    { key: 'video', label: 'Vídeo' },
    { key: 'contactMethod', label: 'Método de Contato' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Criado em' },
    { key: 'updatedAt', label: 'Atualizado em' }
  ]

  return (
    <S.AdsListView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por título ou descrição"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 260, marginRight: 16 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150, marginRight: 16 }}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendente' },
            { value: 'published', label: 'Publicado' },
            { value: 'editing', label: 'Editando' },
            { value: 'rejected', label: 'Rejeitado' },
            { value: 'sold', label: 'Vendido' },
            { value: 'removed', label: 'Removido' }
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
          {/* Upload de Imagens */}
          <Controller
            name="photos"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Fotos (mínimo 1, máximo 6)"
                validateStatus={errors.photos ? 'error' : ''}
                help={errors.photos?.message}
              >
                <Upload
                  name="photos"
                  listType="picture-card"
                  multiple
                  beforeUpload={beforeUploadImage}
                  onChange={handleImageChange}
                  customRequest={({ onSuccess }) =>
                    onSuccess && onSuccess('ok')
                  }
                  fileList={field.value.map((url, index) => ({
                    uid: `${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url
                  }))}
                >
                  {field.value.length < 6 && uploadButton(imageLoading)}
                </Upload>
              </Form.Item>
            )}
          />
          {/* Upload de Vídeo */}
          <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Vídeo (opcional, máximo 1)"
                validateStatus={errors.video ? 'error' : ''}
                help={errors.video?.message}
              >
                <Upload
                  name="video"
                  listType="picture-card"
                  beforeUpload={beforeUploadVideo}
                  onChange={handleVideoChange}
                  customRequest={({ onSuccess }) =>
                    onSuccess && onSuccess('ok')
                  }
                  fileList={
                    field.value
                      ? [
                          {
                            uid: '1',
                            name: 'video',
                            status: 'done',
                            url: field.value
                          }
                        ]
                      : []
                  }
                >
                  {!field.value && uploadButton(videoLoading)}
                </Upload>
              </Form.Item>
            )}
          />
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
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Ex.: 500.00"
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
                  placeholder="Selecione uma categoria"
                  options={[
                    { value: '', label: 'Selecione uma categoria' },
                    // Adicione categorias dinâmicas aqui, ex.: vindo do contexto
                    { value: '1', label: 'Bicicletas' },
                    { value: '2', label: 'Eletrônicos' }
                  ]}
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
                  options={[
                    { value: '', label: 'Selecione a condição' },
                    { value: 'new', label: 'Novo' },
                    { value: 'semi_new', label: 'Seminovo' },
                    { value: 'used', label: 'Usado' }
                  ]}
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
                <Input {...field} placeholder="Ex.: 12345-678" />
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
                <Input
                  {...field}
                  placeholder="Ex.: Rua das Flores, 123, São Paulo - SP"
                  disabled
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
                    { value: 'pending', label: 'Pendente' },
                    { value: 'published', label: 'Publicado' },
                    { value: 'editing', label: 'Editando' },
                    { value: 'rejected', label: 'Rejeitado' },
                    { value: 'sold', label: 'Vendido' },
                    { value: 'removed', label: 'Removido' }
                  ]}
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

      {/* Modal de Edição (mantido como estava) */}
      <FormModal<AdFormData>
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Editar Anúncio"
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
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                <Input {...field} />
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
                  options={[
                    { value: 'new', label: 'Novo' },
                    { value: 'semi_new', label: 'Seminovo' },
                    { value: 'used', label: 'Usado' }
                  ]}
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
            name="photos"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Fotos (URLs separadas por vírgula)"
                validateStatus={errors.photos ? 'error' : ''}
                help={errors.photos?.message}
              >
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.split(','))}
                  value={field.value?.join(',') || ''}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Vídeo (URL)"
                validateStatus={errors.video ? 'error' : ''}
                help={errors.video?.message}
              >
                <Input {...field} />
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
                    { value: 'pending', label: 'Pendente' },
                    { value: 'published', label: 'Publicado' },
                    { value: 'editing', label: 'Editando' },
                    { value: 'rejected', label: 'Rejeitado' },
                    { value: 'sold', label: 'Vendido' },
                    { value: 'removed', label: 'Removido' }
                  ]}
                />
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
        title={`Detalhes do Anúncio: ${selectedAd?.title}`}
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
