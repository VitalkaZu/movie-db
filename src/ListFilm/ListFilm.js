import React from 'react'
import { Space, Spin } from 'antd'
import PropTypes from 'prop-types'
// import MovieService from '../MovieService'
import CardFilm from '../CardFilm'
import './ListFilm.css'
// import CardFilm from '../CardFilm'

function ListFilm({ filmList, guestSessionId }) {
  // movieService = new MovieService()

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     filmList: props.filmList,
  //   }
  // }

  // componentDidMount() {
  //   const { filmList } = this.props
  //   this.setState(() => ({
  //     filmList,
  //   }))
  // this.movieService.getPopular().then((filmList) => {
  //   console.log(filmList)
  //   this.setState({
  //     filmList,
  //   })
  // })
  // }

  // eslint-disable-next-line class-methods-use-this
  const renderFilms = () => {
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

  return <ul className="film-list">{renderFilms()}</ul>
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

export default ListFilm
