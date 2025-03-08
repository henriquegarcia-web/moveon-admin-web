// src/screens/SignInScreen/index.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './styles'
import { Button, Input, Form } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/contexts/AuthProvider'

// Schemas de validação
const loginSchema = yup
  .object({
    email: yup
      .string()
      .email('E-mail inválido')
      .required('E-mail é obrigatório'),
    password: yup.string().required('Senha é obrigatória')
  })
  .required()

const firstAccessSchema = yup
  .object({
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

type SignInFormData = yup.InferType<typeof loginSchema>
type FirstAccessFormData = yup.InferType<typeof firstAccessSchema>

const SignInScreen = () => {
  const navigate = useNavigate()
  const { handleLogin, completeFirstAccess } = useAuth()
  const [isFirstAccess, setIsFirstAccess] = useState(false)
  const [email, setEmail] = useState<string>('')

  // Formulário de login
  const {
    control: loginControl,
    handleSubmit: handleSignInSubmit,
    formState: {
      errors: loginErrors,
      isSubmitting: isSignInSubmitting,
      isValid: isSignInValid
    }
  } = useForm<SignInFormData>({
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
    defaultValues: { name: '', password: '', confirmPassword: '' }
  })

  const onSignInSubmit = async (data: SignInFormData) => {
    try {
      setEmail(data.email)
      await handleLogin(data.email, data.password)
      navigate('/dashboard')
    } catch (error: any) {
      if (error.message === 'FIRST_ACCESS_PENDING') {
        setIsFirstAccess(true)
      }
    }
  }

  const onFirstAccessSubmit = async (data: FirstAccessFormData) => {
    try {
      await completeFirstAccess(email, data.password, data.name)
      navigate('/dashboard')
    } catch (error) {
      // Erros já tratados no contexto
    }
  }

  return (
    <S.SignInScreen>
      <S.SignInContainer active={isFirstAccess ? 1 : 0}>
        <S.SignInLogo src="/logo_green.png" alt="Logo" />

        <S.SignInForm
          onFinish={handleFirstAccessSubmit(onFirstAccessSubmit)}
          layout="vertical"
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
                <Input
                  {...field}
                  placeholder="Digite seu e-mail"
                  onChange={(e) => {
                    field.onChange(e)
                    setEmail(e.target.value)
                  }}
                  disabled={isFirstAccess}
                />
              </Form.Item>
            )}
          />

          <S.SignInFormSection active={!isFirstAccess ? 1 : 0}>
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
                onClick={handleSignInSubmit(onSignInSubmit)}
                disabled={!isSignInValid}
                loading={isSignInSubmitting}
              >
                Entrar
              </Button>
            </S.SignInFormFooter>
          </S.SignInFormSection>

          <S.SignInFormSection active={isFirstAccess ? 1 : 0}>
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
          </S.SignInFormSection>

          <S.SignInFirstAccess
            active={isFirstAccess ? 1 : 0}
            disabled={!email ? 1 : 0}
            onClick={() => email && setIsFirstAccess(!isFirstAccess)}
          >
            {isFirstAccess ? 'Voltar ao SignIn' : 'Primeiro Acesso'}
          </S.SignInFirstAccess>
        </S.SignInForm>
      </S.SignInContainer>
    </S.SignInScreen>
  )
}

export default SignInScreen
