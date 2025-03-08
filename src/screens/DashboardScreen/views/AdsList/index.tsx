// src/screens/DashboardScreen/views/AdsListView/index.tsx
import { useState } from 'react'
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
import { useAds } from '@/contexts/AdsProvider'
import { PiSpinnerGap } from 'react-icons/pi'

// Schema de validação para criação/edição de anúncio
const adSchema = yup
  .object({
    title: yup.string().required('Título é obrigatório'),
    description: yup.string().required('Descrição é obrigatória'),
    price: yup
      .number()
      .required('Preço é obrigatório')
      .min(0, 'Preço deve ser positivo'),
    categoryId: yup.string().required('Categoria é obrigatória'),
    condition: yup
      .string()
      .oneOf(['new', 'semi_new', 'used'])
      .required('Condição é obrigatória'),
    location: yup
      .object({
        address: yup.string().required('Endereço é obrigatório'),
        lat: yup.number().required('Latitude é obrigatória'),
        lng: yup.number().required('Longitude é obrigatória')
      })
      .required(),
    photos: yup
      .array()
      .of(yup.string())
      .min(1, 'Pelo menos uma foto é obrigatória'),
    video: yup.string().optional(),
    contactMethod: yup
      .string()
      .oneOf(['chat', 'whatsapp', 'phone'])
      .required('Método de contato é obrigatório'),
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
    setValue
  } = useForm<AdFormData>({
    resolver: yupResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      condition: 'new',
      location: { address: '', lat: 0, lng: 0 },
      photos: [],
      video: '',
      contactMethod: 'chat',
      status: 'pending'
    }
  })

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
      photos: (data.photos ?? []).filter(
        (photo) => photo !== undefined
      ) as string[]
    })
    setCreateModalVisible(false)
    reset()
  }

  // Submissão do formulário de edição
  const onEditAdSubmit = async (data: AdFormData) => {
    if (selectedAd) {
      await updateAd(selectedAd.id, {
        ...data,
        photos: (data.photos ?? []).filter((photo) => photo !== undefined)
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
      label: 'Localização',
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
                label="Fotos (mínimo 1)"
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
                  } // Simula sucesso para o Ant Design
                  fileList={(field.value ?? []).map((url, index) => ({
                    uid: `${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url
                  }))}
                >
                  {(field.value?.length ?? 0) < 5 && uploadButton(imageLoading)}
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
                label="Vídeo (opcional)"
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
                <Input {...field} />
              </Form.Item>
            )}
          />
          <Controller
            name="location.lat"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Latitude"
                validateStatus={errors.location?.lat ? 'error' : ''}
                help={errors.location?.lat?.message}
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
            name="location.lng"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Longitude"
                validateStatus={errors.location?.lng ? 'error' : ''}
                help={errors.location?.lng?.message}
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
            name="contactMethod"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Método de Contato"
                validateStatus={errors.contactMethod ? 'error' : ''}
                help={errors.contactMethod?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'chat', label: 'Chat' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'phone', label: 'Telefone' }
                  ]}
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
                <Input {...field} />
              </Form.Item>
            )}
          />
          <Controller
            name="location.lat"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Latitude"
                validateStatus={errors.location?.lat ? 'error' : ''}
                help={errors.location?.lat?.message}
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
            name="location.lng"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Longitude"
                validateStatus={errors.location?.lng ? 'error' : ''}
                help={errors.location?.lng?.message}
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
            name="contactMethod"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Método de Contato"
                validateStatus={errors.contactMethod ? 'error' : ''}
                help={errors.contactMethod?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'chat', label: 'Chat' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'phone', label: 'Telefone' }
                  ]}
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
