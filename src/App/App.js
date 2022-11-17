import React from 'react'
import MovieService from '../MovieService'
import CardFilm from '../CardFilm'

export default class App extends React.Component {
  movieServices = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      text: 'FILM',
    }
  }

  // downloadInfo = (id) => {
  //   const { text } = this.state
  //   fetch(
  //     `https://api.themoviedb.org/3/movie/${id}?api_key=a5bc79536e94cb8671d55c4b9eabb5f9`
  //   )
  //     .then((res) => res.json())
  //     .then((body) => console.log(body, text))
  // }

  // eslint-disable-next-line class-methods-use-this

  render() {
    const { text } = this.state
    const film = this.movieServices.getDetail(550).object
    return (
      <div className="text">
        <CardFilm />
        <span>{text}</span>
        <span>{film}</span>
      </div>
    )
  }
}
