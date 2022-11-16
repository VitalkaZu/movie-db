import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: 'Hello',
    }
  }

  render() {
    const { text } = this.state
    return (
      <div className="text">
        <span>{text}</span>
      </div>
    )
  }
}
