// src/utils/styles/common.ts

import styled from 'styled-components'
import { Form, theme } from 'antd'

import Fonts from './fonts'

const { useToken } = theme

export const View = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
`
