import React from 'react'
import './CircleRate.css'

function CircleRate({ percent }) {
  const colorClass = () => {
    const nameClass = 'circle-rate'
    if (percent < 3) return `${nameClass} ${nameClass}_red`
    if (percent < 5) return `${nameClass} ${nameClass}_orange`
    if (percent < 7) return `${nameClass} ${nameClass}_yellow`
    return `${nameClass} ${nameClass}_green`
  }

  return (
    <div className={colorClass()}>
      <span>{percent.toFixed(1)}</span>
    </div>
  )
}

export default CircleRate

// От 0 до 3 - #E90000
// От 3 до 5 - #E97E00
// От 5 до 7 - #E9D100
// Выше 7 - #66E900
