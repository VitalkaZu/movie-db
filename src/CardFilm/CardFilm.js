import { Tag, Rate, Space, Spin, Typography } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
// import EllipsisMiddle from '../EllipsisMiddle'
import MovieService from '../MovieService'
import ErrorIndicator from '../ErrorIndicator'
import CircleRate from '../CircleRate'
import GenresContext from '../GenresContext'
// import { MovieServiceConsumer } from '../MovieServiceContext'
import './Card.css'

const { Paragraph } = Typography
// const { Meta } = Card
// const MovieService = new MovieService()

export default class CardFilm extends React.Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      // film: {},
      loading: false,
      rate: 0,
      error: false,
    }
  }

  componentDidMount() {
    const { id, rate } = this.props
    this.setState({ rate: rate || localStorage.getItem(id) || 0 })
    // this.downloadFilmInfo(id)
  }

  onChangeRate = (rate) => {
    const { guestSessionId, id } = this.props
    this.MovieService.rateMovie(guestSessionId, id, rate)
      .then((result) => {
        this.setState({ rate })
        localStorage.setItem(id, rate)
        console.log(result)
      })
      .catch((e) => console.log(e))
  }

  // downloadFilmInfo(id) {
  //   this.MovieService.getFilm(id)
  //     .then((film) => {
  //       this.setState({
  //         film,
  //         loading: false,
  //         error: false,
  //       })
  //     })
  //     .catch(() => this.setState({ error: true, loading: false }))
  // }

  render() {
    const { loading, error, rate } = this.state
    const { film } = this.props
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorIndicator text="Film not load" /> : null
    const spinner = loading ? <RenderSpiner /> : null
    const content = hasData ? (
      <FilmView film={film} rate={rate} onChangeRate={this.onChangeRate} />
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

// function cutText(text, limit) {
//   if (!text) return null
//   // const z = this.getLastIndexWithoutIgnore(text, ['!', ',', '.'])
//   // console.log(text)
//   const newText = text.slice(0, limit)
//   // text.slice(0, z + 1
//   return newText
// }

function renderGenres(arrGenres, genres) {
  if (genres && arrGenres) {
    return genres.map((genreID) => {
      const genreObj = arrGenres.find(({ id }) => id === genreID)
      return <Tag key={genreObj.id}>{genreObj.name}</Tag>
    })
  }
  return null

  // <Tag key={genre}>{genre}</Tag>)
  // if (!genres) return null
  // return genres.map((genresId) => {
  // arrGenres.filter(el => {
  // })
  //   <Tag key={genre.id}>{genre.name}</Tag>
  // } )
}

function FilmView({ film, onChangeRate, rate }) {
  const {
    title,
    release_date: releaseDate,
    poster_path: posterPath,
    genre_ids: genres,
    vote_average: voteAverage,
    overview,
  } = film
  // const theme = this.context
  // const onChangeRate = (rate) => {
  //   MovieService.rateMovie(guestSessionId, id, rate).then((result) => {
  //     console.log(result.status_message)
  //   })
  // }
  return (
    <>
      <img
        className={`card-poster${posterPath ? ' card-poster-loaded' : ''}`}
        alt="Poster for film"
        // https://image.tmdb.org/t/p/w300_and_h450_bestv2
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
        }
      />
      <div className="card-description ">
        <span className="card-title">
          <span className="card-title-text">{title}</span>
          <CircleRate percent={voteAverage} />
        </span>
        <span className="card-date">{releaseDate}</span>
        <GenresContext.Consumer>
          {(arrGenres) => (
            <div className="card-genres">{renderGenres(arrGenres, genres)}</div>
          )}
        </GenresContext.Consumer>
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
          className="card-rate"
          count={10}
          value={rate}
          onChange={onChangeRate}
        />
        {/* <span>{cutText(overview, 100)}</span> */}
      </div>
    </>
  )
}

CardFilm.contextType = GenresContext

CardFilm.propTypes = {
  id: PropTypes.number.isRequired,
}

// <Card
//   style={{
//     width: 300,
//   }}
//   cover={<img alt="example" src={posterPath} />}
//   actions={[
//     <SettingOutlined key="setting" />,
//     <EditOutlined key="edit" />,
//     <EllipsisOutlined key="ellipsis" />,
//   ]}
// >
//   <Meta
//     avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
//     title={title}
//     description={releaseDate}
//   />
//   {this.renderKeywords(genres)}
//   <Rate disabled allowHalf count={10} value={voteAverage} />
//   <Paragraph ellipsis={{ rows: 2, expandable: true,
//   break_word: false, symbol: '...' }}>
//     {String(overview)}
//   </Paragraph>
// </Card>
