import React from 'react'
import { Pagination, Space, Spin } from 'antd'
import PropTypes from 'prop-types'
import CardFilm from '../CardFilm'
import './ListFilm.css'

export default class ListFilm extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  renderFilms = () => {
    const { filmList, onChangeRate, ratedFilms } = this.props

    if (!filmList) {
      return (
        <Space className="film-list--spin" size="middle">
          <Spin className="film-list--spin" size="large" />
        </Space>
      )
    }
    return filmList.map((film) => (
      <CardFilm
        key={film.id}
        film={film}
        id={film.id}
        // guestSessionId={guestSessionId}
        onChangeRate={(rate) => onChangeRate(rate, film.id)}
        rating={
          Number(film.rating) ||
          Number(ratedFilms.get(film.id)) ||
          Number(localStorage.getItem(film.id)) ||
          0
        }
      />
    ))
  }

  render() {
    const { totalResults, onChangePage, currentPage } = this.props
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

ListFilm.defaultProps = {
  filmList: null,
  totalResults: 0,
}

ListFilm.propTypes = {
  filmList: PropTypes.arrayOf(PropTypes.shape({})),
  totalResults: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  onChangeRate: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ratedFilms: PropTypes.any.isRequired,
}

// export default ListFilm
