// eslint-disable-next-line import/no-extraneous-dependencies
// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
// import { Avatar, Card, Tag, Rate, Typography } from 'antd'
import { Tag, Rate } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
// import EllipsisMiddle from '../EllipsisMiddle'
import MovieService from '../MovieService'
import './Card.css'

// const { Paragraph } = Typography
// const { Meta } = Card

export default class CardFilm extends React.Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      title: null,
      releaseDate: null,
      posterPath: null,
      genres: null,
      voteAverage: null,
      overview: null,
    }
    this.downloadFilmInfo(props.id)
  }

  async downloadFilmInfo(id) {
    await this.MovieService.getDetail(id).then((film) => {
      this.setState(() => ({
        title: film.title,
        releaseDate: film.release_date,
        posterPath: `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${film.poster_path}`,
        genres: film.genres,
        voteAverage: film.vote_average,
        overview: film.overview,
      }))
    })
    // await this.MovieService.getKeywords(id).then((keywords) => {
    //   this.setState(() => ({
    //     keywords,
    //   }))
    // })
  }

  // eslint-disable-next-line class-methods-use-this
  cutText(text, limit) {
    if (!text) return null
    // const z = this.getLastIndexWithoutIgnore(text, ['!', ',', '.'])
    // console.log(text)
    const newText = text.slice(0, limit)
    // text.slice(0, z + 1
    return newText
  }

  // eslint-disable-next-line class-methods-use-this
  renderKeywords(arr) {
    if (!arr) return null
    return arr.map((genre) => <Tag key={genre.id}>{genre.name}</Tag>)
  }

  // getLastIndexWithoutIgnore(text, ignoreArr) {
  //   for (let i = text.length - 1; i >= 0; i -= 1) {
  //     if (ignoreArr.indexOf(text[i]) === -1) {
  //       return i
  //     }
  //   }
  //
  //   return 0
  // }

  // <li className="card">
  // <h2>{title}</h2>
  // <span>{releaseDate}</span>
  // <img alt="Poster film" src={posterPath} />
  // </li>
  render() {
    const { title, releaseDate, posterPath, genres, voteAverage, overview } =
      this.state
    // if (!keywords) {
    //   return null
    // }
    return (
      <div className="card">
        <img className="card-poster" alt="Poster for film" src={posterPath} />
        <div className="card-description ">
          <span className="card-title">{title}</span>
          <span className="card-date">{releaseDate}</span>
          <div className="card-genres">{this.renderKeywords(genres)}</div>
          <Rate
            className="card-rate"
            disabled
            allowHalf
            count={10}
            value={voteAverage}
          />
          <span>{this.cutText(overview, 100)}</span>
        </div>
      </div>
    )
  }
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
