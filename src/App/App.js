import React from 'react'
// import MovieService from '../MovieService'
import { Input } from 'antd'
import ListFilm from '../ListFilm'
import './App2.css'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: 'FILM',
      searchName: null,
      search: null,
    }
  }

  onChangeSeacrh = (e) => {
    this.setState({
      searchName: e.target.value,
    })
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
    this.setState((state) => ({
      search: state.searchName,
    }))
    return null
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
    const { text, searchName, search } = this.state
    return (
      <div className="app">
        <form onSubmit={this.onSubmitSearch}>
          <Input
            placeholder="Type to search..."
            value={searchName}
            onChange={this.onChangeSeacrh}
          />
        </form>
        <ListFilm search={search} />
        <span>{text}</span>
      </div>
    )
  }
}
