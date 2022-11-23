import { Alert } from 'antd'
import React from 'react'

function ErrorIndicator({ text }) {
  return <Alert message="Error" description={text} type="error" showIcon />
}

export default ErrorIndicator
