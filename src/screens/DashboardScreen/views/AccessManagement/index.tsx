// src/screens/DashboardScreen/views/AccessManagementView/index.tsx
import { useState } from 'react'

import * as S from './styles'

import { Button, Tag } from 'antd'
import { useForm } from 'react-hook-form'
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

  // Configuração do formulário
  const formMethods = useForm<CreateAccessFormData>({
    resolver: yupResolver(createAccessSchema),
    defaultValues: { email: '' }
  })

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
        record.firstAccessPending ? (
          <Tag color="orange">Pendente</Tag>
        ) : record.isBlocked ? (
          <Tag color="red">Bloqueado</Tag>
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
            type="link"
            danger
            disabled={record.id === currentAdmin?.id}
            onClick={() => {
              setSelectedAdmin(record)
              setDeleteModalVisible(true)
            }}
          >
            Excluir
          </Button>
          <Button
            type="link"
            disabled={record.id === currentAdmin?.id}
            onClick={() => {
              setSelectedAdmin(record)
              setBlockModalVisible(true)
            }}
          >
            {record.isBlocked ? 'Desbloquear' : 'Bloquear'}
          </Button>
        </S.ActionButtons>
      )
    }
  ]

  // Submissão do formulário
  const handleCreateAccess = async (data: CreateAccessFormData) => {
    await createAccess(data.email)
    setCreateModalVisible(false)
    formMethods.reset()
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
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Criar Acesso
        </Button>
      </ViewHeader>
      <S.AccessManagementViewContent>
        <Table<IAdminProfile>
          columns={columns}
          dataSource={admins}
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
        formMethods={formMethods}
      >
        <form onSubmit={formMethods.handleSubmit(handleCreateAccess)}>
          <S.FormItem>
            <label>E-mail</label>
            <S.Input
              {...formMethods.register('email')}
              placeholder="Digite o e-mail"
            />
            {formMethods.formState.errors.email && (
              <S.ErrorMessage>
                {formMethods.formState.errors.email.message}
              </S.ErrorMessage>
            )}
          </S.FormItem>
          <S.ModalFooter>
            <Button onClick={() => setCreateModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={formMethods.formState.isSubmitting}
            >
              Criar
            </Button>
          </S.ModalFooter>
        </form>
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
      />
    </S.AccessManagementView>
  )
}

export default AccessManagementView
