import { Alert } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function ErrorIndicator({ text }) {
  return <Alert message="Error" description={text} type="error" showIcon />
}

export default ErrorIndicator

ErrorIndicator.propTypes = {
  text: PropTypes.string.isRequired,
}
