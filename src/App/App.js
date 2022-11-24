import React from 'react'
import { Input, Menu, Pagination } from 'antd'
// import { debounce } from 'lodash'
import _debounce from 'lodash/debounce'
import MovieService from '../MovieService'
import ListFilm from '../ListFilm'
import ErrorIndicator from '../ErrorIndicator'
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
      error: false,
    }
  }

  componentDidMount() {
    this.downloadListFilm()
  }

  onChangeSearch = (e) => {
    this.setState({
      searchName: e.target.value,
      currentPage: 1,
    })
    this.debouncedDownloadListFilm()
    // this.downloadListFilm()
    // debounce(this.downloadListFilm, 1000)
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
    this.setState(() => ({ currentPage: 1 }))
    this.downloadListFilm()
  }

  onChangePage = async (page) => {
    await this.setState(() => ({
      currentPage: page,
    }))
    this.downloadListFilm()
  }

  // eslint-disable-next-line class-methods-use-this,react/sort-comp
  debouncedDownloadListFilm = _debounce(this.downloadListFilm, 500)

  // debounceOnChangeSearch() {
  //   return debounce(this.onChangeSearch, 500)
  // }

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
            error: false,
          }))
        })
        .catch(() => this.setState({ error: true }))
    } else {
      this.MovieService.getPopular(currentPage)
        .then((listFilm) => {
          this.setState(() => ({
            filmList: listFilm.results,
            totalResults: listFilm.total_results,
            error: false,
          }))
        })
        .catch(() => this.setState({ error: true }))
    }
  }

  render() {
    const { text, searchName, filmList, currentPage, totalResults, error } =
      this.state
    const errorMesage = error ? (
      <ErrorIndicator text="Film list not load" />
    ) : null
    const renderList = !error ? (
      <>
        <ListFilm filmList={filmList} />
        <Pagination
          current={currentPage}
          onChange={this.onChangePage}
          pageSize={20}
          showSizeChanger={false}
          total={totalResults > 10000 ? 10000 : totalResults}
        />
      </>
    ) : null
    const itemsMenu = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ]
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
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['search']}
          items={itemsMenu}
        />
        <form onSubmit={this.onSubmitSearch}>
          <Input
            placeholder="Type to search..."
            value={searchName}
            onChange={this.onChangeSearch}
          />
        </form>
        {errorMesage}
        {renderList}
        <span>{text}</span>
      </div>
    )
  }
}
