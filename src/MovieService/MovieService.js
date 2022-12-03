export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3'

  _apiKey = 'api_key=a5bc79536e94cb8671d55c4b9eabb5f9'

  async getResource(url) {
    // try {
    console.log('zapros', `${this._baseUrl}${url}`)
    const res = await fetch(`${this._baseUrl}${url}`)
    if (!res.ok) {
      throw new Error(`Error ${url}, status ${res.status}`)
    }
    const body = await res.json()
    return body
    // } catch (e) {
    //   alert(e)
    //   return false
    // }
  }

  getFilm = async (id) => {
    const film = await this.getResource(`/movie/${id}?${this._apiKey}`)
    console.log(film)
    return this._transformFilm(film)
  }

  getPopular = async (page) => {
    const res = await this.getResource(`/movie/popular?${this._apiKey}&page=${page}`)
    return res
  }

  getSearch = async (query, page) => {
    // try {
    let path = `/movie/popular?${this._apiKey}&page=${page}`
    if (query) {
      path = `/search/movie?${this._apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    }
    const res = await this.getResource(path)
    console.log(res.results)
    return res
    // } catch (e) {
    //   alert(e)
    //   return false
    // }
  }

  getKeywords = async (id) => {
    const res = await this.getResource(`/movie/${id}/keywords?${this._apiKey}`)
    return res.keywords
  }

  getMovieGenresList = async () => {
    const res = await this.getResource(`/genre/movie/list?${this._apiKey}`)
    return res
  }

  createGuestSession = async () => {
    const res = await this.getResource(`/authentication/guest_session/new?${this._apiKey}`)
    return res
  }

  rateMovie = async (guestSessionId, filmId, rateValue) => {
    const rate = {
      value: rateValue,
    }

    const response = await fetch(
      `${this._baseUrl}/movie/${filmId}/rating?guest_session_id=${guestSessionId}&${this._apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(rate),
      }
    )
    const result = await response.json()
    return result
  }

  getRatedMovies = async (guestSessionId, page) => {
    const res = await this.getResource(
      `/guest_session/${guestSessionId}/rated/movies?${this._apiKey}&language=en-US&sort_by=created_at.asc&page=${page}`
    )
    console.log(res.results)
    return res
  }

  // eslint-disable-next-line class-methods-use-this
  _transformFilm = (film) => ({
    title: film.title,
    releaseDate: film.release_date,
    posterPath: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${film.poster_path}`,
    genres: film.genres,
    voteAverage: film.vote_average,
    overview: film.overview,
  })
}
