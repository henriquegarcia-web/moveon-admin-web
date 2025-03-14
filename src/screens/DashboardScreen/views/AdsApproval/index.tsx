import { useState } from 'react'
import * as S from './styles'
import { LuCheck, LuX, LuEye } from 'react-icons/lu'
import { Button, Tag, Input } from 'antd'
import { ViewHeader, ConfirmModal, FormModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { IAd } from '@/types'
import { useAds } from '@/contexts/AdsProvider'
import { formatDateTime } from '@/utils/functions/convertTimestamp'

const AdsApprovalView = () => {
  const {
    ads,
    loading,
    approveAd,
    rejectAd,
    formatCep,
    formatPhone,
    formatPrice,
    getCategoryDatail,
    getStatusDatail,
    getConditionDatail
  } = useAds()
  const [searchTerm, setSearchTerm] = useState('')
  const [isApproveModalVisible, setApproveModalVisible] = useState(false)
  const [isRejectModalVisible, setRejectModalVisible] = useState(false)
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // Filtragem de anúncios pendentes
  const pendingAds = ads
    .filter((ad) => ad.status === 'pending')
    .filter(
      (ad) =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      render: () => <Tag color="orange">Pendente</Tag>
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <S.ActionButtons>
          <Button
            icon={<LuCheck />}
            onClick={() => {
              setSelectedAd(record)
              setApproveModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuX />}
            danger
            onClick={() => {
              setSelectedAd(record)
              setRejectModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuEye />}
            onClick={() => {
              setSelectedAd(record)
              setApproveModalVisible(true)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Confirmação de aprovação
  const handleApproveAd = async () => {
    if (selectedAd) {
      await approveAd(selectedAd.id)
      setApproveModalVisible(false)
      setSelectedAd(null)
    }
  }

  // Confirmação de rejeição
  const handleRejectAd = async () => {
    if (selectedAd && rejectionReason) {
      await rejectAd(selectedAd.id, rejectionReason)
      setRejectModalVisible(false)
      setRejectionReason('')
      setSelectedAd(null)
    }
  }

  // Campos para o DetailsForm com tags para categoria e condição, alinhado com AdsListView
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
      render: (value: string) => <Tag>{getStatusDatail(value)?.label}</Tag>
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
    <S.AdsApprovalView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por título ou descrição"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 260, marginRight: 16 }}
        />
      </ViewHeader>
      <S.AdsApprovalViewContent>
        <Table<IAd>
          columns={columns}
          dataSource={pendingAds}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </S.AdsApprovalViewContent>

      {/* Modal de Aprovação/Visualização */}
      <FormModal<any>
        visible={isApproveModalVisible}
        onClose={() => setApproveModalVisible(false)}
        title={`Aprovar Anúncio: ${selectedAd?.id}`}
        formMethods={{} as any}
      >
        {selectedAd && (
          <>
            {selectedAd.video && (
              <S.VideoPreview controls src={selectedAd.video} />
            )}
            {/* <S.ImageGrid>
              {selectedAd.photos.map((photo, index) => (
                <S.ImagePreview
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                />
              ))}
            </S.ImageGrid> */}
            <DetailsForm
              data={selectedAd}
              fields={adDetailsFields}
              column={1}
              bordered
            />
            <S.ModalFooter>
              <Button onClick={() => setApproveModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" onClick={handleApproveAd}>
                Aprovar
              </Button>
            </S.ModalFooter>
          </>
        )}
      </FormModal>

      {/* Modal de Rejeição */}
      <FormModal<any>
        visible={isRejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        title={`Rejeitar Anúncio: #${selectedAd?.id}`}
        formMethods={{} as any}
      >
        {selectedAd && (
          <>
            {selectedAd.video && (
              <S.VideoPreview controls src={selectedAd.video} />
            )}
            {/* <S.ImageGrid>
              {selectedAd.photos.map((photo, index) => (
                <S.ImagePreview
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                />
              ))}
            </S.ImageGrid> */}
            <DetailsForm
              data={selectedAd}
              fields={adDetailsFields}
              column={1}
              bordered
            />
            <Input.TextArea
              placeholder="Motivo da rejeição"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              style={{ marginTop: 16 }}
            />
            <S.ModalFooter>
              <Button onClick={() => setRejectModalVisible(false)}>
                Cancelar
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleRejectAd}
                disabled={!rejectionReason}
              >
                Rejeitar
              </Button>
            </S.ModalFooter>
          </>
        )}
      </FormModal>
    </S.AdsApprovalView>
  )
}

export default AdsApprovalView
