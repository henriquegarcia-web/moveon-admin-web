// src/screens/DashboardScreen/views/AdsListView/index.tsx
import { useState, useEffect } from 'react'
import * as S from './styles'
import { LuTrash, LuSquarePen, LuEye } from 'react-icons/lu'
import { Button, Tag, Form, Select, Input, message } from 'antd'
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

// Funções auxiliares para conversão de dados
const convertCategoriesToOptions = (categories: Category[]) => {
  const options: { value: string; label: string; disabled?: boolean }[] = []
  categories.forEach((category) => {
    // Categoria principal como guia (não selecionável)
    options.push({
      value: category.id,
      label: category.name,
      disabled: true
    })
    // Subcategorias como opções selecionáveis
    category.subcategories.forEach((subcategory) => {
      options.push({
        value: subcategory.id,
        label: `  ${subcategory.name}`, // Espaço para indentação visual
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
      address: yup.string().required('O endereço é obrigatório')
    }),
    // photos: yup
    //   .array()
    //   .of(yup.mixed<File>().required('Cada item deve ser um arquivo'))
    //   .min(1, 'Adicione pelo menos uma foto')
    //   .max(5, 'Máximo de 5 fotos permitido')
    //   .required('Adicione pelo menos uma foto'),
    // video: yup.mixed<File>().optional(),
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
    address: string
  }
  // photos: File[]
  // video?: File
  status: AdStatusType
}

const AdsListView = () => {
  const { ads, loading, createAd, updateAd, deleteAd } = useAds()
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
    resolver: yupResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      categoryId: '',
      condition: 'new',
      location: { cep: '', address: '' },
      // photos: [],
      // video: undefined,
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
                price: record.price ?? undefined // Garantir que price seja number | undefined
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

  // // Handlers para adicionar arquivos localmente
  // const handleImageSelect = (info: any) => {
  //   const files = Array.from(info.fileList).map(
  //     (item: any) => item.originFileObj as File
  //   )
  //   const currentPhotos = watch('photos')
  //   const newPhotos = [...currentPhotos, ...files].slice(0, 5)
  //   setValue('photos', newPhotos, { shouldValidate: true })
  // }

  // const handleVideoSelect = (info: any) => {
  //   const file = info.file.originFileObj as File
  //   setValue('video', file, { shouldValidate: true })
  // }

  // // Função para deletar imagem temporária
  // const handleDeleteImage = (index: number) => {
  //   const currentPhotos = watch('photos')
  //   const updatedPhotos = currentPhotos.filter((_, i) => i !== index)
  //   setValue('photos', updatedPhotos, { shouldValidate: true })
  //   message.success('Imagem removida com sucesso!')
  // }

  // // Função para deletar vídeo temporário
  // const handleDeleteVideo = () => {
  //   setValue('video', undefined, { shouldValidate: true })
  //   message.success('Vídeo removido com sucesso!')
  // }

  // const uploadButton = () => (
  //   <S.AdsUpload>
  //     <LuPlus />
  //     <p>Upload</p>
  //   </S.AdsUpload>
  // )

  // Submissão do formulário com upload para Firebase
  const onCreateAdSubmit = async (data: AdFormData) => {
    try {
      // Upload das imagens
      // const photoUrls = await Promise.all(
      //   data.photos.map((file, index) =>
      //     uploadFileToFirebase(
      //       file,
      //       `ads/images/${Date.now()}_${index}_${file.name}`
      //     )
      //   )
      // )

      // Upload do vídeo (se existir)
      // let videoUrl: string | undefined
      // if (data.video) {
      //   videoUrl = await uploadFileToFirebase(
      //     data.video,
      //     `ads/videos/${Date.now()}_${data.video.name}`
      //   )
      // }

      // Criar o anúncio com as URLs
      await createAd({
        ...data
        // photos: photoUrls,
        // video: videoUrl
      })

      setCreateModalVisible(false)
      reset()
      message.success('Anúncio criado com sucesso!')
    } catch (error) {
      message.error('Erro ao criar o anúncio.')
    }
  }

  // Submissão do formulário de edição
  const onEditAdSubmit = async (data: AdFormData) => {
    if (selectedAd) {
      try {
        // const photoUrls = await Promise.all(
        //   data.photos.map((file, index) =>
        //     typeof file === 'string'
        //       ? file
        //       : uploadFileToFirebase(
        //           file,
        //           `ads/images/${Date.now()}_${index}_${file.name}`
        //         )
        //   )
        // )

        // let videoUrl: string | undefined = undefined
        // if (data.video && typeof data.video !== 'string') {
        //   videoUrl = await uploadFileToFirebase(
        //     data.video,
        //     `ads/videos/${Date.now()}_${data.video.name}`
        //   )
        // }

        await updateAd(selectedAd.id, {
          ...data
          // photos: photoUrls,
          // video: videoUrl
        })
        setEditModalVisible(false)
        reset()
        message.success('Anúncio atualizado com sucesso!')
      } catch (error) {
        message.error('Erro ao atualizar o anúncio.')
      }
    }
  }

  // Confirmação de exclusão
  const handleDeleteAd = async () => {
    if (selectedAd) {
      await deleteAd(selectedAd.id)
      setDeleteModalVisible(false)
      setSelectedAd(null)
      message.success('Anúncio excluído com sucesso!')
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
      render: (value: string[] | undefined) => value?.join(', ') || 'Nenhuma'
    },
    { key: 'video', label: 'Vídeo' },
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
          {/* Upload de Imagens */}
          {/* <Controller
            name="photos"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Fotos (mínimo 1, máximo 5, apenas JPG/PNG)"
                validateStatus={errors.photos ? 'error' : ''}
                help={errors.photos?.message}
              >
                <S.AdFormUploadMedia>
                  <Upload
                    name="photos"
                    listType="picture-card"
                    multiple
                    beforeUpload={beforeUploadImage}
                    onChange={handleImageSelect}
                    fileList={[]}
                    accept="image/jpeg,image/png"
                    showUploadList={false}
                    disabled
                  >
                    {field.value.length < 5 && uploadButton()}
                  </Upload>
                  <S.AdFormMediasWrapper>
                    {field.value.map((image, index) => {
                      const imageUrl = URL.createObjectURL(image)
                      return (
                        <S.AdFormMediaContainer key={image.name}>
                          <S.AdFormMedia
                            src={imageUrl}
                            preview={{ src: imageUrl }}
                            onLoad={() => URL.revokeObjectURL(imageUrl)}
                            width={80}
                            height={80}
                          />
                          <S.AdFormMediaDelete
                            icon={<LuTrash />}
                            danger
                            size="small"
                            onClick={() => handleDeleteImage(index)}
                          />
                        </S.AdFormMediaContainer>
                      )
                    })}
                  </S.AdFormMediasWrapper>
                </S.AdFormUploadMedia>
              </Form.Item>
            )}
          /> */}
          {/* Upload de Vídeo */}
          {/* <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Vídeo (opcional, máximo 1, apenas MP4)"
                validateStatus={errors.video ? 'error' : ''}
                help={errors.video?.message}
              >
                <S.AdFormUploadMedia>
                  <Upload
                    name="video"
                    listType="picture-card"
                    beforeUpload={beforeUploadVideo}
                    onChange={handleVideoSelect}
                    fileList={[]}
                    accept="video/mp4"
                    showUploadList={false}
                    disabled
                  >
                    {!field.value && uploadButton()}
                  </Upload>
                  {field.value && (
                    <S.AdFormMediasWrapper>
                      <S.AdFormMediaContainer key={field.value.name}>
                        <S.AdFormMedia
                          src={URL.createObjectURL(field.value)}
                          preview={{ src: URL.createObjectURL(field.value) }}
                          onLoad={() =>
                            URL.revokeObjectURL(
                              field.value
                                ? URL.createObjectURL(field.value)
                                : ''
                            )
                          }
                          width={80}
                          height={80}
                        />
                        <S.AdFormMediaDelete
                          icon={<LuTrash />}
                          danger
                          size="small"
                          onClick={handleDeleteVideo} // Usar função correta para vídeo
                        />
                      </S.AdFormMediaContainer>
                    </S.AdFormMediasWrapper>
                  )}
                </S.AdFormUploadMedia>
              </Form.Item>
            )}
          /> */}
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
                  value={field.value === undefined ? '' : field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
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
                  value={field.value === undefined ? '' : field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
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
                  options={convertConditionsToOptions(PRODUCT_CONDITION_TYPES)}
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
