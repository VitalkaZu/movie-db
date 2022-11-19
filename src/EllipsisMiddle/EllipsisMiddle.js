import React from 'react'
import { Typography } from 'antd'
import PropTypes from 'prop-types'

const { Text } = Typography
function EllipsisMiddle({ suffixCount, children }) {
  const start = children.slice(0, children.length - suffixCount).trim()
  const suffix = children.slice(-suffixCount).trim()
  return (
    <Text
      style={{
        maxWidth: '100%',
      }}
      ellipsis={{
        suffix,
      }}
    >
      {start}
    </Text>
  )
}

EllipsisMiddle.propTypes = {
  suffixCount: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
}

export default EllipsisMiddle
