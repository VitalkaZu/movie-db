export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3'

  _apiKey = 'api_key=a5bc79536e94cb8671d55c4b9eabb5f9'

  async getResource(url) {
    // console.log('zapros', `${this._baseUrl}${url}`)
    const res = await fetch(`${this._baseUrl}${url}`)
    if (!res.ok) {
      throw new Error(`Error ${url}, status ${res.status}`)
    }
    const body = await res.json()
    return body
  }

  getPopular = async (page) => {
    const res = await this.getResource(
      `/movie/popular?${this._apiKey}&page=${page}`
    )
    return res
  }

  getSearch = async (query, page) => {
    const res = await this.getResource(
      `/search/movie?${this._apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    )
    return res
  }

  getMovieGenresList = async () => {
    const res = await this.getResource(`/genre/movie/list?${this._apiKey}`)
    return res
  }

  createGuestSession = async () => {
    const res = await this.getResource(
      `/authentication/guest_session/new?${this._apiKey}`
    )
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
    // console.log(res.results)
    return res
  }
}

export const movieService = new MovieService()
