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

  render() {
    const { loading, error } = this.state
    const { film, rating, onChangeRate } = this.props
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorIndicator text="Film not load" /> : null
    const spinner = loading ? <RenderSpiner /> : null
    const content = hasData ? (
      <FilmView film={film} rating={rating} onChangeRate={onChangeRate} />
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

function RenderSpiner() {
  return (
    <Space size="middle">
      <Spin size="large" />
    </Space>
  )
}

function renderGenres(arrGenres, genres) {
  if (genres && arrGenres) {
    return genres.map((genreID) => {
      const genreObj = arrGenres.find(({ id }) => id === genreID)
      return <Tag key={genreObj.id}>{genreObj.name}</Tag>
    })
  }
  return null
}

function FilmView({ film, onChangeRate, rating }) {
  const {
    title,
    release_date: releaseDate,
    poster_path: posterPath,
    genre_ids: genres,
    vote_average: voteAverage,
    overview,
  } = film

  return (
    <>
      <PosterCard posterPath={posterPath} />
      <div className="card--header ">
        <span className="card--title">
          <span className="card--title-text">{title}</span>
          <CircleRate percent={voteAverage} />
        </span>
        <span className="card--date">{releaseDate}</span>
        <GenresContext.Consumer>
          {(arrGenres) => (
            <div className="card--genres">
              {renderGenres(arrGenres, genres)}
            </div>
          )}
        </GenresContext.Consumer>
      </div>
      <div className="card--description">
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
          className="card--rate"
          count={10}
          value={rating}
          onChange={onChangeRate}
        />
      </div>
    </>
  )
}

CardFilm.contextType = GenresContext

CardFilm.defaultProps = {
  rating: 0,
}

CardFilm.propTypes = {
  film: PropTypes.shape({}).isRequired,
  onChangeRate: PropTypes.func.isRequired,
  rating: PropTypes.number,
}

FilmView.defaultProps = {
  rating: 0,
}

FilmView.propTypes = {
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
