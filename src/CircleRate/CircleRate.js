import React from 'react'
import './CircleRate.css'

function CircleRate({ percent }) {
  return (
    <div className="circle-rate">
      <span>{percent.toFixed(1)}</span>
    </div>
  )
}

export default CircleRate
