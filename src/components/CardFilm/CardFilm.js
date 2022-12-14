import { Tag, Rate, Space, Spin, Typography } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import ErrorIndicator from '../../UI/ErrorIndicator'
import CircleRate from '../../UI/CircleRate'
import PosterCard from '../PosterCard'
import GenresContext from '../../context/GenresContext'
import './Card.css'

const { Paragraph } = Typography

export default class CardFilm extends React.Component {
  // MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: false,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderGenres = (arrGenres, genres) => {
    if (genres && arrGenres) {
      return genres.map((genreID) => {
        const genreObj = arrGenres.find(({ id }) => id === genreID)
        return <Tag key={genreObj.id}>{genreObj.name}</Tag>
      })
    }
    return null
  }

  render() {
    const { loading, error } = this.state
    const { film, rating, onChangeRate } = this.props
    const {
      title,
      release_date: releaseDate,
      poster_path: posterPath,
      genre_ids: genres,
      vote_average: voteAverage,
      overview,
    } = film
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorIndicator text="Film not load" /> : null
    const spinner = loading ? (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    ) : null
    const content = hasData ? (
      <>
        <PosterCard posterPath={posterPath} />
        <div className="card__header ">
          <span className="card__title">
            <span className="card__title-text">{title}</span>
            <CircleRate percent={voteAverage} />
          </span>
          <span className="card__date">{releaseDate}</span>
          <GenresContext.Consumer>
            {(arrGenres) => (
              <div className="card__genres">
                {this.renderGenres(arrGenres, genres)}
              </div>
            )}
          </GenresContext.Consumer>
        </div>
        <div className="card__description">
          <Paragraph
            ellipsis={{
              rows: 4,
              expandable: false,
              symbol: '...',
            }}
          >
            {String(overview)}
          </Paragraph>
          <Rate
            className="card__rate"
            count={10}
            value={rating}
            onChange={onChangeRate}
          />
        </div>
      </>
    ) : null

    return (
      <div className="card">
        {errorMessage}
        {spinner}
        {content}
      </div>
    )
  }
}

CardFilm.contextType = GenresContext

CardFilm.defaultProps = {
  rating: 0,
}

CardFilm.propTypes = {
  film: PropTypes.shape({
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    vote_average: PropTypes.number.isRequired,
    overview: PropTypes.string,
  }).isRequired,
  onChangeRate: PropTypes.func.isRequired,
  rating: PropTypes.number,
}
