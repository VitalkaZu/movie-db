import React from 'react'
import { Pagination, Space, Spin } from 'antd'
// import PropTypes from 'prop-types'
import CardFilm from '../CardFilm'
import './ListFilm.css'

export default class ListFilm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
    }
  }

  componentDidMount() {
    // this.downloadListFilm()
    // const { filmList } = this.props
    // this.setState(() => ({
    //   filmList,
    // }))
  }

  // eslint-disable-next-line class-methods-use-this
  renderFilms = () => {
    // const { filmList } = this.state
    const { guestSessionId, filmList } = this.props
    if (!filmList) {
      return (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )
    }
    return filmList.map((film) => (
      <CardFilm
        key={film.id}
        film={film}
        id={film.id}
        guestSessionId={guestSessionId}
        rate={film.rating}
      />
    ))
  }

  render() {
    const { error } = this.state
    const { totalResults, onChangePage, currentPage } = this.props
    console.log(error)
    return (
      <>
        <ul className="film-list">{this.renderFilms()}</ul>
        <Pagination
          className="pagination"
          current={currentPage}
          onChange={onChangePage}
          pageSize={20}
          showSizeChanger={false}
          total={totalResults > 10000 ? 10000 : totalResults}
        />
      </>
    )
  }
}

// ListFilm.propTypes = {
//   // eslint-disable-next-line react/
//   require-default-props,react/forbid-prop-types
//   filmList: PropTypes.array,
// }

// export default ListFilm
