import React from 'react'
import { Input, Tabs, Spin, Space, Modal } from 'antd'
// Input,
// import { debounce } from 'lodash'
import _debounce from 'lodash/debounce'
import { Offline, Online } from 'react-detect-offline'
import MovieService from '../MovieService'
import ListFilm from '../ListFilm'
import GenresContext from '../GenresContext'
// import ErrorIndicator from '../ErrorIndicator'
// import { MovieServiceProvider } from '../MovieServiceContext'
import './App2.css'

// const GenresContext = React.createContext()

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
      // error: false,
      functionLoadFilms: (page) => {
        const { sendSearchName } = this.state
        console.log(sendSearchName)
        return this.MovieService.getSearch(sendSearchName, page)
      },
      guestSessionId: null,
      genresList: null,
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
      // currentPage: 1,
    })
    this.debouncedSearchName()
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitSearch = (e) => {
    e.preventDefault()
    // this.setState(() => ({ currentPage: 1 }))
    // this.downloadListFilm()
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
      this.MovieService.createGuestSession()
        .then((res) => {
          this.setState({
            guestSessionId: res.guest_session_id,
          })
          localStorage.clear()
          localStorage.setItem('guest_session_id', res.guest_session_id)
          localStorage.setItem('expires_at', res.expires_at)
        })
        .catch((e) => console.log(e))
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
    functionLoadFilms(currentPage)
      .then((listFilm) => {
        console.log(listFilm)
        this.setState(() => ({
          filmList: listFilm.results,
          totalResults: listFilm.total_results,
          loading: false,
          // error: false,
        }))
      })
      .catch((e) => console.log(e))
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
      loading,
    } = this.state

    const films = !loading ? (
      <ListFilm
        filmList={filmList}
        sendSearchName={sendSearchName}
        currentPage={currentPage}
        onChangePage={this.onChangePage}
        totalResults={totalResults}
        guestSessionId={guestSessionId}
      />
    ) : null

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
            {spinner}
            {films}
          </div>
        ),
      },
    ]

    const error = () => {
      Modal.error({
        title: 'Internet connection error',
        content: 'Internet connection error',
      })
    }

    const polling = {
      enabled: true,
      url: 'https://www.themoviedb.org/documentation/api',
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
        <Offline polling={polling} onChange={error}>
          <p>Нет Интернета</p>
        </Offline>
      </>
    )
  }
}
