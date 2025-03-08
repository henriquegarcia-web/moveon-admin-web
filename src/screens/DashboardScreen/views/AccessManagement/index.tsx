// src/screens/DashboardScreen/views/AccessManagementView/index.tsx

import { useState } from 'react'

import * as S from './styles'
import { LuLock, LuLockOpen, LuTrash } from 'react-icons/lu'

import { Button, Tag, Form } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ViewHeader, FormModal, ConfirmModal } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { useAuth } from '@/contexts/AuthProvider'
import { IAdminProfile } from '@/types'
import { useSettings } from '@/contexts/SettingsProvider'

// Schema de validação para criação de acesso
const createAccessSchema = yup
  .object({
    email: yup
      .string()
      .email('E-mail inválido')
      .required('E-mail é obrigatório')
  })
  .required()

type CreateAccessFormData = yup.InferType<typeof createAccessSchema>

const AccessManagementView = () => {
  const { admins, loading, createAccess, deleteAccess, toggleBlockAccess } =
    useSettings()
  const { admin: currentAdmin } = useAuth()

  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isBlockModalVisible, setBlockModalVisible] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<IAdminProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset
  } = useForm<CreateAccessFormData>({
    resolver: yupResolver(createAccessSchema),
    defaultValues: { email: '' }
  })

  // Filtragem dos administradores com base no termo de pesquisa
  const filteredAdmins = admins.filter((admin: IAdminProfile) =>
    [admin.email, admin.name || ''].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Colunas da tabela
  const columns: TableColumn<IAdminProfile>[] = [
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (value) => value || '-'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) =>
        record.isBlocked ? (
          <Tag color="red">Bloqueado</Tag>
        ) : record.firstAccessPending ? (
          <Tag color="orange">Pendente</Tag>
        ) : (
          <Tag color="green">Ativo</Tag>
        )
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <S.ActionButtons>
          <Button
            danger
            icon={<LuTrash />}
            disabled={record.id === currentAdmin?.id}
            onClick={() => {
              setSelectedAdmin(record)
              setDeleteModalVisible(true)
            }}
            size="small"
          />
          <Button
            danger={record.isBlocked}
            icon={record.isBlocked ? <LuLock /> : <LuLockOpen />}
            disabled={record.id === currentAdmin?.id}
            onClick={() => {
              setSelectedAdmin(record)
              setBlockModalVisible(true)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Submissão do formulário
  const onCreateAccessSubmit = async (data: CreateAccessFormData) => {
    await createAccess(data.email)
    setCreateModalVisible(false)
    reset()
  }

  // Confirmação de exclusão
  const handleDeleteAccess = async () => {
    if (selectedAdmin) {
      await deleteAccess(selectedAdmin.id)
      setDeleteModalVisible(false)
      setSelectedAdmin(null)
    }
  }

  // Confirmação de bloqueio/desbloqueio
  const handleToggleBlockAccess = async () => {
    if (selectedAdmin) {
      await toggleBlockAccess(selectedAdmin.id, !selectedAdmin.isBlocked)
      setBlockModalVisible(false)
      setSelectedAdmin(null)
    }
  }

  return (
    <S.AccessManagementView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por e-mail ou nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Criar Acesso
        </Button>
      </ViewHeader>
      <S.AccessManagementViewContent>
        <Table<IAdminProfile>
          columns={columns}
          dataSource={filteredAdmins}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowClassName={(record) =>
            record.id === currentAdmin?.id ? 'ant-table-row-disabled' : ''
          }
        />
      </S.AccessManagementViewContent>

      {/* Modal de Criação */}
      <FormModal<CreateAccessFormData>
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Criar Novo Acesso"
        formMethods={
          { control, handleSubmit, formState: { errors, isSubmitting } } as any
        }
      >
        <S.CreateAccessForm
          onFinish={handleSubmit(onCreateAccessSubmit)}
          layout="vertical"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="E-mail"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <S.Input {...field} placeholder="Digite o e-mail" />
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
        </S.CreateAccessForm>
      </FormModal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteAccess}
        onCancel={() => setDeleteModalVisible(false)}
        title="Confirmação de Exclusão"
        content="Tem certeza que deseja excluir este acesso? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Confirmação de Bloqueio/Desbloqueio */}
      <ConfirmModal
        visible={isBlockModalVisible}
        onConfirm={handleToggleBlockAccess}
        onCancel={() => setBlockModalVisible(false)}
        title={
          selectedAdmin?.isBlocked ? 'Desbloquear Acesso' : 'Bloquear Acesso'
        }
        content={`Tem certeza que deseja ${
          selectedAdmin?.isBlocked ? 'desbloquear' : 'bloquear'
        } o acesso de ${selectedAdmin?.email}?`}
        confirmText={selectedAdmin?.isBlocked ? 'Desbloquear' : 'Bloquear'}
        cancelText="Cancelar"
        type="danger"
      />
    </S.AccessManagementView>
  )
}

export default AccessManagementView
