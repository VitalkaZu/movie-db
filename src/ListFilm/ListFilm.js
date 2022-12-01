import React from 'react'
import { Pagination, Space, Spin } from 'antd'
import PropTypes from 'prop-types'
// import MovieService from '../MovieService'
import CardFilm from '../CardFilm'
import './ListFilm.css'
// import CardFilm from '../CardFilm'

export default class ListFilm extends React.Component {
  // movieService = new MovieService()
  // ({ filmList, guestSessionId })
  constructor(props) {
    super(props)
    this.state = {
      filmList: props.filmList,
      currentPage: 1,
      totalResults: null,
      error: false,
    }
  }

  componentDidMount() {
    this.downloadListFilm()
    // const { filmList } = this.props
    // this.setState(() => ({
    //   filmList,
    // }))
  }

  componentDidUpdate(prevProps) {
    const { functionDownload } = this.props
    if (prevProps.functionDownload !== functionDownload) {
      this.setState({ currentPage: 1 })
      this.downloadListFilm()
    }
  }

  // this.movieService.getPopular().then((filmList) => {
  //   console.log(filmList)
  //   this.setState({
  //     filmList,
  //   })
  // })
  // }

  onChangePage = async (page) => {
    await this.setState(() => ({
      currentPage: page,
    }))
    this.downloadListFilm()
  }

  downloadListFilm() {
    const { currentPage } = this.state
    const { functionDownload, searchName } = this.props
    if (searchName) {
      functionDownload(searchName, currentPage)
        .then((listFilm) => {
          this.setState(() => ({
            filmList: listFilm.results,
            totalResults: listFilm.total_results,
            error: false,
          }))
        })
        .catch(() => this.setState({ error: true }))
    } else {
      functionDownload(currentPage)
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

  // eslint-disable-next-line class-methods-use-this
  renderFilms = () => {
    const { filmList } = this.state
    const { guestSessionId } = this.props
    if (!filmList) {
      return (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )
    }
    return filmList.map((film) => (
      <CardFilm key={film.id} id={film.id} guestSessionId={guestSessionId} />
    ))
  }

  render() {
    const { currentPage, totalResults, error } = this.state
    console.log(error)
    return (
      <>
        <ul className="film-list">{this.renderFilms()}</ul>
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
}
// <ul className="film-list">{items}</ul>
//   render() {
//     const { filmList } = this.state
//     if (!filmList) {
//       return (
//         <Space size="middle">
//           <Spin size="small" />
//           <Spin />
//           <Spin size="large" />
//         </Space>
//       )
//     }
//     const items = this.renderFilms(filmList)
//     return <ul className="film-list">{items}</ul>
//   )
// }

ListFilm.propTypes = {
  // eslint-disable-next-line react/require-default-props,react/forbid-prop-types
  filmList: PropTypes.array,
}

// export default ListFilm
