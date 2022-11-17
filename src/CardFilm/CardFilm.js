import React from 'react'
import MovieService from '../MovieService'

export default class CardFilm extends React.Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      title: null,
      releaseDate: null,
      posterPath: null,
      tagline: null,
    }
    this.downloadFilmInfo(550)
  }

  downloadFilmInfo(id) {
    this.MovieService.getDetail(id).then((film) => {
      this.setState({
        title: film.title,
        releaseDate: film.release_date,
        posterPath: film.poster_path,
        tagline: film.tagline,
      })
    })
  }

  render() {
    const { title, releaseDate, posterPath, tagline } = this.state
    return (
      <div className="card">
        <h2>{title}</h2>
        <span>{releaseDate}</span>
        <span>{tagline}</span>
        <img alt="Poster film" src={posterPath} />
      </div>
    )
  }
}
