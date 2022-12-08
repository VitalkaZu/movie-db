// import React from 'react'
// import PropTypes from 'prop-types'
// import { Space, Spin } from 'antd'
// import CardFilm from '../CardFilm'
//
// // eslint-disable-next-line class-methods-use-this
// function RenderFilms({ filmList, onChangeRate, ratedFilms }) {
//   if (!filmList) {
//     return (
//       <Space className="film-list__spin" size="middle">
//         <Spin className="film-list__spin" size="large" />
//       </Space>
//     )
//   }
//   return filmList.map((film) => (
//     <CardFilm
//       key={film.id}
//       film={film}
//       id={film.id}
//       // guestSessionId={guestSessionId}
//       onChangeRate={(rate) => onChangeRate(rate, film.id)}
//       rating={
//         Number(film.rating) ||
//         Number(ratedFilms.get(film.id)) ||
//         Number(localStorage.getItem(film.id)) ||
//         0
//       }
//     />
//   ))
// }
//
// RenderFilms.defaultProps = {
//   filmList: null,
// }
//
// RenderFilms.propTypes = {
//   filmList: PropTypes.arrayOf(PropTypes.shape({})),
//   onChangeRate: PropTypes.func.isRequired,
//   // eslint-disable-next-line react/forbid-prop-types
//   ratedFilms: PropTypes.any.isRequired,
// }
//
// export default RenderFilms
