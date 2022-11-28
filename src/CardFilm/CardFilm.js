import { Tag, Rate, Space, Spin } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
// import EllipsisMiddle from '../EllipsisMiddle'
import MovieService from '../MovieService'
import ErrorIndicator from '../ErrorIndicator'
import CircleRate from '../CircleRate'
import './Card.css'

// const { Paragraph } = Typography
// const { Meta } = Card
// const MovieService = new MovieService()

export default class CardFilm extends React.Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      film: {},
      loading: true,
      error: false,
    }
  }

  componentDidMount() {
    const { id } = this.props
    this.downloadFilmInfo(id)
  }

  downloadFilmInfo(id) {
    this.MovieService.getFilm(id)
      .then((film) => {
        this.setState({
          film,
          loading: false,
          error: false,
        })
      })
      .catch(() => this.setState({ error: true, loading: false }))
  }

  render() {
    const { film, loading, error } = this.state
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorIndicator text="Film not load" /> : null
    const spinner = loading ? <RenderSpiner /> : null
    const content = hasData ? <FilmView film={film} /> : null

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

function cutText(text, limit) {
  if (!text) return null
  // const z = this.getLastIndexWithoutIgnore(text, ['!', ',', '.'])
  // console.log(text)
  const newText = text.slice(0, limit)
  // text.slice(0, z + 1
  return newText
}

function renderKeywords(arr) {
  if (!arr) return null
  return arr.map((genre) => <Tag key={genre.id}>{genre.name}</Tag>)
}

function FilmView({ film }) {
  const {
    title,
    releaseDate,
    posterPath,
    genres,
    voteAverage,
    overview,
    // guestSessionId,
    // id,
  } = film

  // const onChangeRate = (rate) => {
  //   MovieServices.rateMovie(guestSessionId, id, rate).then((result) => {
  //     console.log(result.status_message)
  //   })
  // }

  return (
    <>
      <img className="card-poster" alt="Poster for film" src={posterPath} />
      <div className="card-description ">
        <span className="card-title">
          <span className="card-title-text">{title}</span>
          <CircleRate percent={voteAverage} />
        </span>
        <span className="card-date">{releaseDate}</span>
        <div className="card-genres">{renderKeywords(genres)}</div>
        <Rate
          className="card-rate"
          count={10}
          value={voteAverage}
          // onChange={onChangeRate}
        />
        <span>{cutText(overview, 100)}</span>
      </div>
    </>
  )
}

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
//   <Paragraph ellipsis={{ rows: 2, expandable: true, break_word: false, symbol: '...' }}>
//     {String(overview)}
//   </Paragraph>
// </Card>
