import React from 'react'
import { Input, Tabs, Spin, Space, Modal } from 'antd'
import _debounce from 'lodash/debounce'
import { Offline, Online } from 'react-detect-offline'
import movieService from '../../services/MovieService'
import ListFilm from '../ListFilm'
import ErrorIndicator from '../../UI/ErrorIndicator'
import GenresContext from '../../context/GenresContext'
import './App.css'

export default class App extends React.Component {
  debouncedSearchName = _debounce(() => {
    const { searchName } = this.state
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
      currentTab: 'search',
      guestSessionId: null,
      genresList: null,
      ratedFilms: new Map(),
    }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    this.createGuestSession()
    this.downloadGenresList()
    this.downloadFilms()
    this.textInput.current.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTab, sendSearchName, currentPage } = this.state
    if (prevState.sendSearchName !== sendSearchName) {
      this.setState({
        currentPage: 1,
      })
      this.downloadFilms()
    }
    if (prevState.currentTab !== currentTab) {
      this.setState({
        currentPage: 1,
      })
      if (currentTab === 'search') {
        this.downloadFilms()
      } else {
        this.downloadRatedFilms()
      }
    }
    if (prevState.currentPage !== currentPage) {
      if (currentTab === 'search') {
        this.downloadFilms()
      } else {
        this.downloadRatedFilms()
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
    this.setState({
      currentTab: keyTab,
    })
    // if (keyTab === 'search') {
    //   this.downloadFilms()
    // }
    // if (keyTab === 'rated') {
    //   this.downloadRatedFilms()
    // }
  }

  onChangeRate = (rate, id) => {
    const { guestSessionId } = this.state
    movieService
      .rateMovie(guestSessionId, id, rate)
      .then(() => {
        // this.setState({ rate })
        this.setState(({ ratedFilms }) => ({
          ratedFilms: new Map(ratedFilms.set(id, rate)),
        }))
        localStorage.setItem(id, rate)
      })
      .catch((e) => {
        this.onError(e)
      })
  }

  onError(e) {
    this.setState({ error: e.message, loading: false })
  }

  downloadFilms = () => {
    const { sendSearchName, currentPage } = this.state
    const { getSearch, getPopular } = movieService
    if (sendSearchName) {
      this.downloadListFilm(() => getSearch(sendSearchName, currentPage))
    } else {
      this.downloadListFilm(() => getPopular(currentPage))
    }
  }

  downloadRatedFilms = () => {
    const { guestSessionId, currentPage } = this.state
    const { getRatedMovies } = movieService
    this.downloadListFilm(() => getRatedMovies(guestSessionId, currentPage))
  }

  downloadGenresList() {
    movieService.getMovieGenresList().then(({ genres }) => {
      this.setState({ genresList: genres })
    })
  }

  createGuestSession() {
    if (
      Date.parse(localStorage.getItem('expires_at')) < Date.now() ||
      !localStorage.getItem('expires_at')
    ) {
      try {
        movieService
          .createGuestSession()
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

  downloadListFilm(functionLoadFilms) {
    this.setState({
      loading: true,
    })
    try {
      functionLoadFilms()
        .then((listFilm) => {
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
        // functionLoad={}
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
      enabled: false,
      // до этого отправлял запросы на муви, что бы понять проходят ли запросы.
      // А то интрент может быть включен, но из-за блокровки сервис не доступен
      // enabled: true,
      // url: 'www.themoviedb.org/',
    }

    return (
      <>
        <Online polling={polling}>
          <GenresContext.Provider value={genresList}>
            <div className="app">
              <Tabs
                items={items}
                centered
                // destroyInactiveTabPane
                onChange={this.onChangeTab}
              />
            </div>
          </GenresContext.Provider>
        </Online>
        <Offline polling={polling} onChange={errorNetwork} />
      </>
    )
  }
}
