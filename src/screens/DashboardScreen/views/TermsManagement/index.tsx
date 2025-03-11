import { useState } from 'react'
import * as S from './styles'
import { Button, Card } from 'antd'
import { LuSquarePen, LuEye } from 'react-icons/lu'
import { Editor } from '@tinymce/tinymce-react'
import { ViewHeader, FormModal } from '@/components'
import { useSettings } from '@/contexts/SettingsProvider'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { ITermDocument } from '@/types'

interface ITermsManagementView {}

type TermFormData = {
  content: string // Manteremos como string para compatibilidade com o backend
}

const TermsManagementView = ({}: ITermsManagementView) => {
  const { terms, updateTerm } = useSettings()
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isViewModalVisible, setViewModalVisible] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<ITermDocument | null>(null)
  const [selectedTermForView, setSelectedTermForView] =
    useState<ITermDocument | null>(null)

  // Configuração do formulário para edição
  const formMethods = useForm<TermFormData>({
    mode: 'onChange',
    defaultValues: {
      content: ''
    }
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid }
  } = formMethods

  // Função para abrir o modal de edição
  const handleEdit = (term: ITermDocument) => {
    setSelectedTerm(term)
    setEditModalVisible(true)
    reset({ content: term.content })
  }

  // Função para abrir o modal de visualização
  const handleView = (term: ITermDocument) => {
    setSelectedTermForView(term)
    setViewModalVisible(true)
  }

  // Função para salvar as alterações
  const onEditTermSubmit = async (data: TermFormData) => {
    if (selectedTerm) {
      await updateTerm(selectedTerm.id, data.content)
      setEditModalVisible(false)
      reset()
      setSelectedTerm(null)
    }
  }

  return (
    <S.TermsManagementView>
      <S.TermsManagementViewContent>
        {terms?.map((term) => (
          <S.TermCard
            key={term.id}
            title={term.title}
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  icon={<LuEye />}
                  onClick={() => handleView(term)}
                  size="small"
                >
                  Visualizar
                </Button>
                <Button
                  icon={<LuSquarePen />}
                  onClick={() => handleEdit(term)}
                  size="small"
                >
                  Editar
                </Button>
              </div>
            }
            style={{ marginBottom: 16 }}
          >
            <S.TermContent>
              <p>
                <strong>Última atualização:</strong>{' '}
                {moment(selectedTermForView?.updatedAt).format(
                  'DD/MM/YYYY HH:mm'
                )}
              </p>
            </S.TermContent>
          </S.TermCard>
        ))}
      </S.TermsManagementViewContent>

      {/* Modal de Edição */}
      <FormModal<TermFormData>
        visible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false)
          setSelectedTerm(null)
          reset()
        }}
        title={`Editar ${selectedTerm?.title}`}
        formMethods={formMethods}
      >
        <S.TermForm onFinish={handleSubmit(onEditTermSubmit)} layout="vertical">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_MCE_APU}
                value={field.value}
                onEditorChange={(newValue: string) => field.onChange(newValue)}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
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
        </S.TermForm>
      </FormModal>

      {/* Modal de Visualização */}
      <FormModal
        visible={isViewModalVisible}
        onClose={() => {
          setViewModalVisible(false)
          setSelectedTermForView(null)
        }}
        title={`Visualizar ${selectedTermForView?.title}`}
        formMethods={{} as any} // Não precisa de formulário, apenas exibição
      >
        <S.TermContentView>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedTermForView?.content || ''
            }}
          />
          <p>
            <strong>Última atualização:</strong>{' '}
            {moment(selectedTermForView?.updatedAt).format('DD/MM/YYYY HH:mm')}
          </p>
        </S.TermContentView>
        <S.ModalFooter>
          <Button onClick={() => setViewModalVisible(false)}>Fechar</Button>
        </S.ModalFooter>
      </FormModal>
    </S.TermsManagementView>
  )
}

export default TermsManagementView
