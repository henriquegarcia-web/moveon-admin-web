// src/screens/DashboardScreen/views/UsersListView/index.tsx
import { useState } from 'react'
import * as S from './styles'
import { LuLock, LuLockOpen, LuEye } from 'react-icons/lu'

import { Button, Tag } from 'antd'
import { ViewHeader, ConfirmModal, FormModal, DetailsForm } from '@/components'
import Table, { TableColumn } from '@/components/Table'
import { IUserProfile } from '@/types'
import { useUsers } from '@/contexts/UsersProvider'

const UsersListView = () => {
  const { users, loading, toggleBlockUser } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [isBlockModalVisible, setBlockModalVisible] = useState(false)
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null)

  // Filtragem dos usuários com base no termo de pesquisa
  const filteredUsers = users.filter((user: IUserProfile) =>
    [user.email, user.name || ''].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Colunas da tabela
  const columns: TableColumn<IUserProfile>[] = [
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
        ) : (
          <Tag color="green">Ativo</Tag>
        )
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <S.ActionButtons>
          <Button
            icon={record.isBlocked ? <LuLock /> : <LuLockOpen />}
            danger={record.isBlocked}
            onClick={() => {
              setSelectedUser(record)
              setBlockModalVisible(true)
            }}
            size="small"
          />
          <Button
            icon={<LuEye />}
            onClick={() => {
              setSelectedUser(record)
              setDetailsModalVisible(true)
            }}
            size="small"
          />
        </S.ActionButtons>
      )
    }
  ]

  // Confirmação de bloqueio/desbloqueio
  const handleToggleBlockUser = async () => {
    if (selectedUser) {
      await toggleBlockUser(selectedUser.id, !selectedUser.isBlocked)
      setBlockModalVisible(false)
      setSelectedUser(null)
    }
  }

  // Campos para o DetailsForm
  const userDetailsFields = [
    { key: 'email', label: 'E-mail' },
    { key: 'name', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'phone', label: 'Telefone' },
    { key: 'birthDate', label: 'Data de Nascimento' },
    {
      key: 'address',
      label: 'Endereço',
      render: (value: IUserProfile['address']) =>
        value.zipcode
          ? `${value.street}, ${value.number}, ${value.neighborhood}, ${
              value.city
            } - ${value.state}, ${value.zipcode}${
              value.complement ? `, ${value.complement}` : ''
            }`
          : '-'
    },
    {
      key: 'profilePicture',
      label: 'Foto de Perfil',
      render: (value: string) =>
        value ? (
          <a href={value} target="_blank">
            Ver Foto
          </a>
        ) : (
          '-'
        )
    },
    { key: 'trustLevel', label: 'Nível de Confiança' },
    {
      key: 'isVerified',
      label: 'Verificado',
      render: (value: boolean) => (value ? 'Sim' : 'Não')
    },
    {
      key: 'socialMedia',
      label: 'Redes Sociais',
      render: (value: IUserProfile['socialMedia']) =>
        value
          ? `${value.instagram || '-'}, ${value.twitter || '-'}, ${
              value.facebook || '-'
            }`
          : '-'
    },
    { key: 'createdAt', label: 'Criado em' },
    { key: 'updatedAt', label: 'Atualizado em' },
    {
      key: 'interests',
      label: 'Interesses',
      render: (value: IUserProfile['interests']) =>
        value
          ? `Esportes: ${value.sports
              .map((s) => s.name)
              .join(', ')} | Torneios: ${value.tournaments
              .map((t) => t.name)
              .join(', ')}`
          : '-'
    },
    {
      key: 'settings',
      label: 'Configurações',
      render: (value: IUserProfile['settings']) =>
        value ? `Idioma: ${value.language} | Tema: ${value.theme}` : '-'
    },
    {
      key: 'isBlocked',
      label: 'Bloqueado',
      render: (value: boolean) => (value ? 'Sim' : 'Não')
    }
  ]

  return (
    <S.UsersListView>
      <ViewHeader>
        <S.SearchInput
          placeholder="Pesquisar por e-mail ou nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 260, marginRight: 16 }}
        />
      </ViewHeader>
      <S.UsersListViewContent>
        <Table<IUserProfile>
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </S.UsersListViewContent>

      {/* Modal de Confirmação de Bloqueio/Desbloqueio */}
      <ConfirmModal
        visible={isBlockModalVisible}
        onConfirm={handleToggleBlockUser}
        onCancel={() => setBlockModalVisible(false)}
        title={
          selectedUser?.isBlocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'
        }
        content={`Tem certeza que deseja ${
          selectedUser?.isBlocked ? 'desbloquear' : 'bloquear'
        } o usuário ${selectedUser?.email}?`}
        confirmText={selectedUser?.isBlocked ? 'Desbloquear' : 'Bloquear'}
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Visualização de Detalhes */}
      <FormModal<any>
        visible={isDetailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        title={`Usuário: ${selectedUser?.name}`}
        formMethods={{} as any}
      >
        {selectedUser && (
          <>
            <DetailsForm
              data={selectedUser}
              fields={userDetailsFields}
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
    </S.UsersListView>
  )
}

export default UsersListView
