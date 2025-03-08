import styled from 'styled-components'
import { theme } from 'antd'

import { Screen } from '@/utils/styles/globals'
import { FormattedForm } from '@/utils/styles/common'
import Fonts from '@/utils/styles/fonts'

const { useToken } = theme

export const SignInScreen = styled(Screen)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`

export const SignInContainer = styled.div<{ active: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${({ active }) => (active ? '400px' : '320px')};
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const SignInLogo = styled.img`
  position: absolute;
  bottom: 100%;
  width: 140px;
  margin-bottom: 15px;
`

export const SignInHeader = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100%;
  padding: 6px 0 6px 10px;
  margin-bottom: 15px;

  h2 {
    font-size: ${Fonts.large};
    line-height: ${Fonts.large};
  }

  p {
    font-size: ${Fonts.xs};
    line-height: ${Fonts.xs};
  }

  border-left: 4px solid ${() => useToken().token.colorPrimary};
`

export const SignInForm = styled(FormattedForm)`
  align-items: center;

  button {
    width: 100% !important;
  }
`

export const SignInFormSection = styled.div<{
  active: number
}>`
  display: ${({ active }) => (active ? 'flex' : 'none')};
  flex-direction: column;
  row-gap: 12px;
  width: 100%;
`

export const SignInFormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  button {
    width: 48%;
  }
`

export const SignInFirstAccess = styled.div<{
  active: number
  disabled: number
}>`
  position: absolute;
  top: 100%;
  margin-top: 15px;
  transition: 0.3s;
  cursor: pointer;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};

  font-size: ${Fonts.xxxs};

  color: ${({ disabled }) =>
    disabled
      ? useToken().token.colorTextDescription
      : useToken().token.colorTextLabel};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? '1' : '0.8')};
  }
`

// export const OtherTemplateScreen = styled.div`
//   display: flex;
// `
