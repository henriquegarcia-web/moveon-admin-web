import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './styles'
import { Button, Input, Form, message } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/contexts/AuthProvider'

// Schema de validação para login
const loginSchema = yup
  .object({
    email: yup
      .string()
      .email('E-mail inválido')
      .required('E-mail é obrigatório'),
    password: yup.string().required('Senha é obrigatória')
  })
  .required()

// Schema de validação para primeiro acesso
const firstAccessSchema = yup
  .object({
    email: yup
      .string()
      .email('E-mail inválido')
      .required('E-mail é obrigatório'),
    name: yup.string().required('Nome é obrigatório'),
    password: yup
      .string()
      .min(6, 'Mínimo de 6 caracteres')
      .required('Senha é obrigatória'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Senhas devem coincidir')
      .required('Confirmação é obrigatória')
  })
  .required()

type LoginFormData = yup.InferType<typeof loginSchema>
type FirstAccessFormData = yup.InferType<typeof firstAccessSchema>

const SignInScreen = () => {
  const navigate = useNavigate()
  const { login, completeFirstAccess } = useAuth()
  const [isFirstAccess, setIsFirstAccess] = useState(false)

  // Formulário de login
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: {
      errors: loginErrors,
      isSubmitting: isLoginSubmitting,
      isValid: isLoginValid
    }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  // Formulário de primeiro acesso
  const {
    control: firstAccessControl,
    handleSubmit: handleFirstAccessSubmit,
    formState: {
      errors: firstAccessErrors,
      isSubmitting: isFirstAccessSubmitting,
      isValid: isFirstAccessValid
    }
  } = useForm<FirstAccessFormData>({
    resolver: yupResolver(firstAccessSchema),
    defaultValues: { email: '', name: '', password: '', confirmPassword: '' }
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      message.success('Login realizado com sucesso!')
      navigate('/dashboard')
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        message.error('Credenciais inválidas ou primeiro acesso necessário.')
      } else {
        message.error('Erro ao fazer login. Tente novamente.')
      }
    }
  }

  const onFirstAccessSubmit = async (data: FirstAccessFormData) => {
    try {
      await completeFirstAccess(data.email, data.password, data.name)
      message.success('Primeiro acesso concluído com sucesso!')
      setIsFirstAccess(false)
      navigate('/dashboard')
    } catch (error) {
      message.error('Erro ao completar primeiro acesso. Tente novamente.')
    }
  }

  return (
    <S.SignInScreen>
      <S.SignInContainer active={isFirstAccess ? 1 : 0}>
        <S.SignInLogo src="/logo_green.png" alt="Logo" />

        <S.SignInHeader>
          <h2>Painel de Administrador</h2>
          <p>{!isFirstAccess ? 'Entrar' : 'Primeiro Acesso'}</p>
        </S.SignInHeader>

        <S.SignInForm
          onFinish={handleLoginSubmit(onLoginSubmit)}
          layout="vertical"
          style={{ display: isFirstAccess ? 'none' : 'flex' }}
        >
          <Controller
            name="email"
            control={loginControl}
            render={({ field }) => (
              <Form.Item
                label="E-mail"
                validateStatus={loginErrors.email ? 'error' : ''}
                help={loginErrors.email?.message}
              >
                <Input {...field} placeholder="Digite seu e-mail" />
              </Form.Item>
            )}
          />

          <Controller
            name="password"
            control={loginControl}
            render={({ field }) => (
              <Form.Item
                label="Senha"
                validateStatus={loginErrors.password ? 'error' : ''}
                help={loginErrors.password?.message}
              >
                <Input.Password {...field} placeholder="Digite sua senha" />
              </Form.Item>
            )}
          />

          <S.SignInFormFooter>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isLoginValid}
              loading={isLoginSubmitting}
            >
              Entrar
            </Button>
          </S.SignInFormFooter>
        </S.SignInForm>

        <S.SignInForm
          onFinish={handleFirstAccessSubmit(onFirstAccessSubmit)}
          layout="vertical"
          style={{ display: isFirstAccess ? 'flex' : 'none' }}
        >
          <Controller
            name="email"
            control={firstAccessControl}
            render={({ field }) => (
              <Form.Item
                label="E-mail"
                validateStatus={firstAccessErrors.email ? 'error' : ''}
                help={firstAccessErrors.email?.message}
              >
                <Input {...field} placeholder="Digite seu e-mail" />
              </Form.Item>
            )}
          />

          <Controller
            name="name"
            control={firstAccessControl}
            render={({ field }) => (
              <Form.Item
                label="Nome Completo"
                validateStatus={firstAccessErrors.name ? 'error' : ''}
                help={firstAccessErrors.name?.message}
              >
                <Input {...field} placeholder="Digite seu nome completo" />
              </Form.Item>
            )}
          />

          <Controller
            name="password"
            control={firstAccessControl}
            render={({ field }) => (
              <Form.Item
                label="Senha"
                validateStatus={firstAccessErrors.password ? 'error' : ''}
                help={firstAccessErrors.password?.message}
              >
                <Input.Password {...field} placeholder="Digite sua senha" />
              </Form.Item>
            )}
          />

          <Controller
            name="confirmPassword"
            control={firstAccessControl}
            render={({ field }) => (
              <Form.Item
                label="Confirmar Senha"
                validateStatus={
                  firstAccessErrors.confirmPassword ? 'error' : ''
                }
                help={firstAccessErrors.confirmPassword?.message}
              >
                <Input.Password {...field} placeholder="Confirme sua senha" />
              </Form.Item>
            )}
          />

          <S.SignInFormFooter>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isFirstAccessValid}
              loading={isFirstAccessSubmitting}
            >
              Concluir Primeiro Acesso
            </Button>
          </S.SignInFormFooter>
        </S.SignInForm>

        <S.SignInFirstAccess
          active={isFirstAccess ? 1 : 0}
          onClick={() => setIsFirstAccess(!isFirstAccess)}
        >
          {isFirstAccess ? 'Voltar ao Login' : 'Primeiro Acesso'}
        </S.SignInFirstAccess>
      </S.SignInContainer>
    </S.SignInScreen>
  )
}

export default SignInScreen
