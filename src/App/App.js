import React from 'react'
import { Input, Tabs } from 'antd'
// Input,
// import { debounce } from 'lodash'
import _debounce from 'lodash/debounce'
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
      // error: false,
      functionLoadFilms: (page) => this.MovieService.getSearch('', page),
      guestSessionId: null,
      ratedFilms: null,
      genresList: null,
    }
  }

  componentDidMount() {
    this.createGuestSession()
    this.downloadGenresList()
    this.downloadListFilm()
  }

  componentDidUpdate(prevProps, prevState) {
    const { functionLoadFilms, sendSearchName } = this.state
    if (
      prevState.functionLoadFilms !== functionLoadFilms ||
      prevState.sendSearchName !== sendSearchName
    ) {
      this.downloadListFilm()
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { guestSessionId } = this.state
  //   if (prevState.guestSessionId !== guestSessionId) {
  //     // this.downloadRatedFimls()
  //   }
  // }

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

  onChangeTab = (keyTab) => {
    console.log(keyTab)
    const { guestSessionId } = this.state
    if (keyTab === 'search') {
      this.setState({
        functionLoadFilms: (page) => {
          const { sendSearchName } = this.state
          console.log(sendSearchName)
          return this.MovieService.getSearch(sendSearchName, page)
        },
      })
    }
    if (keyTab === 'rated') {
      this.setState({
        functionLoadFilms: (page) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          this.MovieService.getRatedMovies(guestSessionId, page),
      })
    }
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
    // const { functionDownload } = this.props
    functionLoadFilms(currentPage)
      .then((listFilm) => {
        console.log(listFilm)
        this.setState(() => ({
          filmList: listFilm.results,
          totalResults: listFilm.total_results,
          // error: false,
        }))
      })
      .catch((e) => console.log(e))
  }

  // eslint-disable-next-line class-methods-use-this,react/sort-comp
  // debouncedDownloadListFilm = _debounce(this.downloadListFilm, 500)
  // debounceOnChangeSearch() {
  //   return debounce(this.onChangeSearch, 500)
  // }

  // downloadListFilm() {
  //   const { searchName, currentPage } = this.state
  //   if (searchName) {
  //     // console.log(searchName)
  //     this.MovieService.getSearch(searchName, currentPage)
  //       .then((listFilm) => {
  //         console.log(listFilm)
  //         this.setState(() => ({
  //           filmList: listFilm.results,
  //           totalResults: listFilm.total_results,
  //           error: false,
  //         }))
  //       })
  //       .catch(() => this.setState({ error: true }))
  //   } else {
  //     this.MovieService.getPopular(currentPage)
  //       .then((listFilm) => {
  //         this.setState(() => ({
  //           filmList: listFilm.results,
  //           totalResults: listFilm.total_results,
  //           error: false,
  //         }))
  //       })
  //       .catch(() => this.setState({ error: true }))
  //   }
  // }

  // downloadRatedFimls(guestSessionId) {
  //   // const { guestSessionId } = this.state
  //   this.MovieService.getRatedMovies(guestSessionId)
  //     .then((listFilm) => {
  //       console.log(listFilm)
  //       this.setState(() => ({
  //         ratedFilms: listFilm.results,
  //       }))
  //     })
  //     .catch((e) => console.log(e))
  // }

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

  // ratedFilms() {
  //   const { guestSessionId } = this.state
  //   return <p>{guestSessionId}</p>
  // }

  // renderList() {
  //   const {
  //     // filmList,
  //     // ratedFilms,
  //     // currentPage,
  //     // totalResults,
  //     error,
  //     // guestSessionId,
  //   } = this.state
  //   if (error) {
  //     return <ErrorIndicator text="Film list not load" />
  //   }
  //   return (
  //     <>
  //       <ListFilm
  //         functionDownload={this.MovieService.getPopular}
  //         // filmList={filmList}
  //         // ratedFilms={ratedFilms}
  //         // guestSessionId={guestSessionId}
  //       />
  //       {/* <Pagination */}
  //       {/*  current={currentPage} */}
  //       {/*  onChange={this.onChangePage} */}
  //       {/*  pageSize={20} */}
  //       {/*  showSizeChanger={false} */}
  //       {/*  total={totalResults > 10000 ? 10000 : totalResults} */}
  //       {/* /> */}
  //     </>
  //   )
  // }

  render() {
    const {
      // searchName,
      filmList,
      ratedFilms,
      guestSessionId,
      genresList,
      sendSearchName,
      totalResults,
    } = this.state
    // console.log(functionDownload)
    const items = [
      {
        label: 'Search',
        key: 'search',
        children: (
          <>
            {this.searchForm()}
            {/* {this.renderList()} */}
            <ListFilm
              // functionDownload={(page) => {
              //   this.MovieService.getSearch(sendSearchName, page)
              // }}
              filmList={filmList}
              sendSearchName={sendSearchName}
              // searchName={searchName}
              ratedFilms={ratedFilms}
              // filmList={filmList}
              // ratedFilms={ratedFilms}
              totalResults={totalResults}
              guestSessionId={guestSessionId}
            />
          </>
        ),
      },
      {
        label: 'Rated',
        key: 'rated',
        children: (
          <ListFilm
            // functionDownload={(page) => {
            //   this.MovieService.getRatedMovies(guestSessionId, page)
            // }}
            // searchName={searchName}
            filmList={filmList}
            ratedFilms={ratedFilms}
            guestSessionId={guestSessionId}
            totalResults={totalResults}
          />
        ),
      },
    ]

    return (
      <GenresContext.Provider value={genresList}>
        <div className="app">
          <Tabs items={items} onChange={this.onChangeTab} />
        </div>
      </GenresContext.Provider>
    )
  }
}
