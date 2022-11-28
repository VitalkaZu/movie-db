import React from 'react'
import { Input, Pagination, Tabs } from 'antd'
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
      searchName: null,
      filmList: null,
      currentPage: 1,
      totalResults: null,
      error: false,
      guestSessionId: null,
      ratedFilms: null,
    }
  }

  componentDidMount() {
    this.downloadListFilm()
    this.MovieService.createGuestSession()
      .then((guestSessionId) => {
        this.setState({
          guestSessionId,
        })
      })
      .catch(() => this.setState({ error: true }))
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

  searchForm() {
    const { searchName } = this.state
    return (
      <form onSubmit={this.onSubmitSearch}>
        <Input
          placeholder="Type to search..."
          value={searchName}
          onChange={this.onChangeSearch}
        />
      </form>
    )
  }

  ratedFilms() {
    const { guestSessionId } = this.state
    return <p>{guestSessionId}</p>
  }

  renderList() {
    const {
      filmList,
      ratedFilms,
      currentPage,
      totalResults,
      error,
      guestSessionId,
    } = this.state
    if (error) {
      return <ErrorIndicator text="Film list not load" />
    }
    return (
      <>
        <ListFilm
          filmList={filmList}
          ratedFilms={ratedFilms}
          guestSessionId={guestSessionId}
        />
        <Pagination
          current={currentPage}
          onChange={this.onChangePage}
          pageSize={20}
          showSizeChanger={false}
          total={totalResults > 10000 ? 10000 : totalResults}
        />
      </>
    )
  }

  render() {
    const items = [
      {
        label: 'Search',
        key: 'search',
        children: (
          <>
            {this.searchForm()}
            {this.renderList()}
          </>
        ),
      },
      { label: 'Rated', key: 'rated', children: <>{this.ratedFilms()}</> },
    ]

    return (
      <div className="app">
        <Tabs items={items} />
      </div>
    )
  }
}
