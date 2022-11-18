// eslint-disable-next-line import/no-extraneous-dependencies
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Tag, Rate } from 'antd'
import React from 'react'

import PropTypes from 'prop-types'
import MovieService from '../MovieService'

const { Meta } = Card

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
      }))
    })
    // await this.MovieService.getKeywords(id).then((keywords) => {
    //   this.setState(() => ({
    //     keywords,
    //   }))
    // })
  }

  // eslint-disable-next-line class-methods-use-this
  renderKeywords(arr) {
    if (!arr) return null
    return arr.map((genre) => <Tag key={genre.id}>{genre.name}</Tag>)
  }

  // <li className="card">
  // <h2>{title}</h2>
  // <span>{releaseDate}</span>
  // <img alt="Poster film" src={posterPath} />
  // </li>
  render() {
    const { title, releaseDate, posterPath, genres, voteAverage } = this.state
    // if (!keywords) {
    //   return null
    // }
    return (
      <Card
        style={{
          width: 300,
        }}
        cover={<img alt="example" src={posterPath} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={title}
          description={releaseDate}
        />
        {this.renderKeywords(genres)}
        <Rate disabled allowHalf defaultValue={voteAverage} />
      </Card>
    )
  }
}

CardFilm.propTypes = {
  id: PropTypes.number.isRequired,
}
