import React, { Component } from 'react'
import { Space, Spin } from 'antd'
import './PosterCard.css'
// import PropTypes from 'prop-types'

class PosterCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  imageIsLoad = () => {
    this.setState({
      loading: false,
    })
  }

  render() {
    const { posterPath } = this.props
    const { loading } = this.state

    const poster = (
      <img
        style={{ display: !loading ? 'flex' : 'none' }}
        onLoad={this.imageIsLoad}
        className={`card-poster${posterPath ? ' card-poster-loaded' : ''}`}
        alt="Poster for film"
        // https://image.tmdb.org/t/p/w300_and_h450_bestv2
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
        }
      />
    )

    const spinner = loading ? (
      <Space
        className="card-poster"
        style={{ display: loading ? 'flex' : 'none' }}
        size="middle"
      >
        <Spin className="card-spin" size="large" />
      </Space>
    ) : null

    return (
      <>
        {spinner}
        {poster}
      </>
    )
  }
}

// PosterCard.propTypes = {}

export default PosterCard
