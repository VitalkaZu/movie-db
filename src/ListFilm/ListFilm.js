import React from 'react'
import MovieService from '../MovieService'
import CardFilm from '../CardFilm'
import './ListFilm.css'
// import CardFilm from '../CardFilm'

export default class ListFilm extends React.Component {
  movieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      filmList: null,
    }
  }

  componentDidMount() {
    this.movieService.getPopular().then((filmList) => {
      console.log(filmList)
      this.setState({
        filmList,
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  renderFilms(arrFilms) {
    return arrFilms.map((film) => <CardFilm key={film.id} id={film.id} />)
  }

  // <ul className="film-list">{items}</ul>
  render() {
    const { filmList } = this.state
    if (!filmList) {
      return null
    }
    const items = this.renderFilms(filmList)
    return <ul className="film-list">{items}</ul>
  }
}
