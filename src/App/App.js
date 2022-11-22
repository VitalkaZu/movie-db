import React from 'react'
import { Input } from 'antd'
import MovieService from '../MovieService'
import ListFilm from '../ListFilm'
import './App2.css'

export default class App extends React.Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      text: 'FILM',
      searchName: null,
      filmList: null,
    }
    this.downloadPopular()
  }

  onChangeSearch = (e) => {
    this.setState({
      searchName: e.target.value,
    })
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
    const { searchName } = this.state
    if (searchName) {
      // console.log(searchName)
      this.MovieService.getSearch(searchName)
        .then((listFilm) => {
          console.log(listFilm)
          this.setState(() => ({
            filmList: listFilm,
          }))
        })
        .catch((error) => alert(error))
    } else {
      this.downloadPopular()
    }
    // await this.setState((state) => ({
    //
    //   search: state.searchName,
    // }))
    // return null
  }

  async downloadPopular() {
    await this.MovieService.getPopular().then((filmList) => {
      this.setState(() => ({
        filmList,
      }))
    })
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
    const { text, searchName, filmList } = this.state
    return (
      <div className="app">
        <form onSubmit={this.onSubmitSearch}>
          <Input
            placeholder="Type to search..."
            value={searchName}
            onChange={this.onChangeSearch}
          />
        </form>
        <ListFilm filmList={filmList} />
        <span>{text}</span>
      </div>
    )
  }
}
