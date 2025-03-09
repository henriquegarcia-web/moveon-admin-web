// src/utils/styles/common.ts

import styled from 'styled-components'
import { Form, Menu, theme } from 'antd'

import Fonts from './fonts'
import { Globals } from './globals'

const { useToken } = theme

export const View = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: 100%;
`

export const ViewHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${Globals.dashboard.view.headerHeight};
  padding: 0 ${Globals.dashboard.padding};
  border-radius: 8px;

  border: 1px solid ${() => useToken().token.colorBorderSecondary};
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
`

export const ViewContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding: ${Globals.dashboard.padding};
  border-radius: 8px;

  border: 1px solid ${() => useToken().token.colorBorderSecondary};
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
`

export const FormattedForm = styled(Form)<{ onFinish: any }>`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  width: 100%;

  .ant-form-item {
    width: 100%;
    margin-bottom: 0px;

    .ant-form-item-label {
      padding-bottom: 5px !important;

      label {
        font-size: 12px;
      }
    }

    .ant-input-password {
      padding: 0 11px;
      box-shadow: none !important;

      .ant-input {
        padding: 0;
        padding-bottom: 1px;
        height: 32.4px;
      }
    }

    .ant-input {
      font-size: ${Fonts.xs};
      height: 34px;
      padding: 0 11px 1px 11px;

      &:focus {
        box-shadow: none !important;
      }

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${() => useToken().token.colorBgElevated}
          inset !important;
        -webkit-text-fill-color: ${() =>
          useToken().token.colorTextBase} !important;
      }
    }

    .ant-form-item-explain-error {
      margin-top: 5px;

      font-size: 12px;
    }

    .ant-picker-input input {
      font-size: ${Fonts.xs};
      padding: 3px 0px 3px 0px;
    }

    .ant-select-selection-placeholder {
      font-size: ${Fonts.xs} !important;
    }
  }

  .ant-picker {
    width: 100%;
    padding-block: 2px !important;

    input {
      font-size: ${Fonts.xs};
    }
  }

  textarea {
    resize: none;
    height: initial !important;
    padding: 8px 11px !important;
  }

  .ant-segmented-item {
    transition: ${() => useToken().token.colorPrimary} 3s
      cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    /* color: white; */
  }
  .ant-segmented-item-selected {
    background-color: ${() => useToken().token.colorPrimary};
    color: white;
  }

  .ant-segmented-thumb {
    background-color: ${() => useToken().token.colorPrimary};
    color: white;
  }

  .ant-upload {
    width: 80px !important;
    height: 80px !important;
  }
`

export const FormattedMenu = styled(Menu)<{ opened: number }>`
  &.ant-menu {
    border-right: none !important;

    // Esconde as labels das categorias quando o menu está fechado
    .ant-menu-item-group-title {
      display: ${({ opened }) => (opened ? 'block' : 'none')} !important;
      padding: 10px 0px 2px 4px !important;

      /* padding: 10px 24px !important; */
      font-size: ${Fonts.xxxs} !important;
      font-weight: 400 !important;

      color: ${() => useToken().token.colorTextDescription} !important;
    }

    // Ajusta os itens do menu quando fechado
    .ant-menu-item {
      height: 34px !important;
      padding: ${({ opened }) => (opened ? '0 14px' : '0 14px')} !important;
      border-radius: 6px !important;

      .anticon svg {
        font-size: ${Fonts.small} !important;
      }

      .ant-menu-title-content {
        display: ${({ opened }) => (opened ? 'inline' : 'none')} !important;

        font-size: ${Fonts.xxxs} !important;
        font-weight: 400 !important;
      }
    }
  }
`
