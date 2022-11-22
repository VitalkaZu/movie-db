import React from 'react'
import { Input, Menu, Pagination } from 'antd'
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
      currentPage: 1,
      totalResults: null,
    }
    this.downloadListFilm()
  }

  onChangeSearch = (e) => {
    this.setState({
      searchName: e.target.value,
    })
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
    this.downloadListFilm()
  }

  onChangePage = async (page) => {
    await this.setState(() => ({
      currentPage: page,
    }))
    this.downloadListFilm()
  }

  downloadListFilm() {
    const { searchName, currentPage } = this.state
    if (searchName) {
      // console.log(searchName)
      this.MovieService.getSearch(searchName, currentPage)
        .then((listFilm) => {
          console.log(listFilm)
          this.setState(() => ({
            filmList: listFilm.results,
            totalResults: listFilm.total_results,
          }))
        })
        .catch((error) => alert(error))
    } else {
      this.MovieService.getPopular(currentPage).then((listFilm) => {
        this.setState(() => ({
          filmList: listFilm.results,
          totalResults: listFilm.total_results,
        }))
      })
    }
  }

  // async downloadPopular() {
  //   await this.MovieService.getPopular().then((filmList) => {
  //     this.setState(() => ({
  //       filmList,
  //     }))
  //   })
  // }

  // downloadInfo = (id) => {
  //   const { text } = this.state
  //   fetch(
  //     `https://api.themoviedb.org/3/movie/${id}?api_key=a5bc79536e94cb8671d55c4b9eabb5f9`
  //   )
  //     .then((res) => res.json())
  //     .then((body) => console.log(body, text))
  // }

  render() {
    const { text, searchName, filmList, currentPage, totalResults } = this.state
    return (
      <div className="app">
        {/* <Tabs */}
        {/*  defaultActiveKey="1" */}
        {/*  centered */}
        {/*  items={new Array(3).fill(null).map((_, i) => { */}
        {/*    const id = String(i + 1) */}
        {/*    return { */}
        {/*      label: `Tab ${id}`, */}
        {/*      key: id, */}
        {/*      children: `Content of Tab Pane ${id}`, */}
        {/*    } */}
        {/*  })} */}
        {/* /> */}
        <Menu mode="horizontal" defaultSelectedKeys={['mail']}>
          <Menu.Item key="search">Search</Menu.Item>
          <Menu.Item key="rated">Rated</Menu.Item>
        </Menu>
        <form onSubmit={this.onSubmitSearch}>
          <Input
            placeholder="Type to search..."
            value={searchName}
            onChange={this.onChangeSearch}
          />
        </form>
        <ListFilm filmList={filmList} />
        <Pagination
          current={currentPage}
          onChange={this.onChangePage}
          PageSize={20}
          showSizeChanger={false}
          total={totalResults}
        />
        <span>{text}</span>
      </div>
    )
  }
}
