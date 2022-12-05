import React from 'react'
import { Input, Tabs, Spin, Space, Modal } from 'antd'
import _debounce from 'lodash/debounce'
import { Offline, Online } from 'react-detect-offline'
import MovieService from '../MovieService'
import ListFilm from '../ListFilm'
import ErrorIndicator from '../ErrorIndicator'
import GenresContext from '../GenresContext'
import './App.css'

export default class App extends React.Component {
  MovieService = new MovieService()

  debouncedSearchName = _debounce(() => {
    const { searchName } = this.state
    console.log('Call debounce function')
    this.setState({
      sendSearchName: searchName,
    })
  }, 1000)

  constructor(props) {
    super(props)
    this.state = {
      searchName: null,
      sendSearchName: null,
      filmList: null,
      currentPage: 1,
      totalResults: null,
      loading: false,
      error: null,
      functionLoadFilms: (page) => this.MovieService.getPopular(page),
      guestSessionId: null,
      genresList: null,
      ratedFilms: new Map(),
    }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    this.createGuestSession()
    this.downloadGenresList()
    this.downloadListFilm()
    this.textInput.current.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    const { functionLoadFilms, sendSearchName, currentPage } = this.state
    if (
      prevState.functionLoadFilms !== functionLoadFilms ||
      prevState.currentPage !== currentPage
    ) {
      this.downloadListFilm()
    }
    if (prevState.sendSearchName !== sendSearchName) {
      if (sendSearchName) {
        this.downloadSearchFilms()
      } else {
        this.downloadPopularFilms()
      }
    }
  }

  onChangeSearch = (e) => {
    this.setState({
      searchName: e.target.value,
    })
    this.debouncedSearchName()
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
  }

  onChangePage = (page) => {
    this.setState({ currentPage: page })
  }

  onChangeTab = (keyTab) => {
    console.log(keyTab)
    const { sendSearchName } = this.state

    if (keyTab === 'search') {
      if (sendSearchName) {
        this.downloadSearchFilms()
      } else {
        this.downloadPopularFilms()
      }
    }
    if (keyTab === 'rated') {
      this.downloadRatedFilms()
    }
  }

  onChangeRate = (rate, id) => {
    const { guestSessionId } = this.state
    this.MovieService.rateMovie(guestSessionId, id, rate)
      .then((result) => {
        // this.setState({ rate })
        this.setState(({ ratedFilms }) => ({
          ratedFilms: new Map(ratedFilms.set(id, rate)),
        }))
        localStorage.setItem(id, rate)
        console.log(result)
      })
      .catch((e) => console.log(e))
  }

  onError(e) {
    console.log(e.message)
    this.setState({ error: e.message, loading: false })
  }

  downloadPopularFilms() {
    this.setState({
      currentPage: 1,
      functionLoadFilms: (page) => this.MovieService.getPopular(page),
    })
  }

  downloadSearchFilms() {
    this.setState({
      currentPage: 1,
      functionLoadFilms: (page) => {
        const { sendSearchName } = this.state
        console.log(sendSearchName)
        return this.MovieService.getSearch(sendSearchName, page)
      },
    })
  }

  downloadRatedFilms() {
    const { guestSessionId } = this.state
    this.setState({
      currentPage: 1,
      functionLoadFilms: (page) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        this.MovieService.getRatedMovies(guestSessionId, page),
    })
  }

  downloadGenresList() {
    this.MovieService.getMovieGenresList().then(({ genres }) => {
      this.setState({ genresList: genres })
    })
  }

  createGuestSession() {
    if (
      Date.parse(localStorage.getItem('expires_at')) < Date.now() ||
      !localStorage.getItem('expires_at')
    ) {
      try {
        this.MovieService.createGuestSession()
          .then((res) => {
            this.setState({
              guestSessionId: res.guest_session_id,
            })
            localStorage.clear()
            localStorage.setItem('guest_session_id', res.guest_session_id)
            localStorage.setItem('expires_at', res.expires_at)
          })
          .catch((e) => {
            this.onError(e)
          })
      } catch (e) {
        this.onError(e)
      }
    } else {
      this.setState({
        guestSessionId: localStorage.getItem('guest_session_id'),
      })
    }
  }

  downloadListFilm() {
    const { currentPage, functionLoadFilms } = this.state
    console.log(currentPage, functionLoadFilms)
    this.setState({
      loading: true,
    })
    try {
      functionLoadFilms(currentPage)
        .then((listFilm) => {
          console.log(listFilm)
          this.setState(() => ({
            filmList: listFilm.results,
            totalResults: listFilm.total_results,
            loading: false,
          }))
        })
        .catch((e) => {
          this.onError(e)
        })
    } catch (e) {
      this.onError(e)
    }
  }

  render() {
    const {
      filmList,
      guestSessionId,
      genresList,
      searchName,
      sendSearchName,
      totalResults,
      currentPage,
      ratedFilms,
      loading,
      error,
    } = this.state

    const hasData = !(loading || error)

    const films = hasData ? (
      <ListFilm
        filmList={filmList}
        sendSearchName={sendSearchName}
        currentPage={currentPage}
        onChangePage={this.onChangePage}
        onChangeRate={this.onChangeRate}
        totalResults={totalResults}
        guestSessionId={guestSessionId}
        ratedFilms={ratedFilms}
      />
    ) : null

    const errorIndicator = error ? <ErrorIndicator text={error} /> : null

    const spinner = loading ? (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    ) : null

    const items = [
      {
        label: 'Search',
        key: 'search',
        children: (
          <div className="wrapper">
            <form onSubmit={this.onSubmitSearch}>
              <Input
                placeholder="Type to search..."
                value={searchName}
                onChange={this.onChangeSearch}
                ref={this.textInput}
              />
            </form>
            {errorIndicator}
            {spinner}
            {films}
          </div>
        ),
      },
      {
        label: 'Rated',
        key: 'rated',
        children: (
          <div className="wrapper">
            {errorIndicator}
            {spinner}
            {films}
          </div>
        ),
      },
    ]

    const errorNetwork = (e) => {
      Modal.destroyAll()
      if (!e) {
        Modal.error({
          title: 'Internet connection error',
          content: 'Internet connection error',
        })
      } else {
        Modal.success({
          content: 'Internet connection is OK',
        })
      }
    }

    const polling = {
      enabled: true,
      url: 'www.themoviedb.org/',
    }

    return (
      <>
        <Online polling={polling}>
          <GenresContext.Provider value={genresList}>
            <div className="app">
              <Tabs items={items} centered onChange={this.onChangeTab} />
            </div>
          </GenresContext.Provider>
        </Online>
        <Offline polling={polling} onChange={errorNetwork} />
      </>
    )
  }
}
