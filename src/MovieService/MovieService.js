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
    const res = await this.getResource(
      `/movie/popular?${this._apiKey}&page=${page}`
    )
    return res
  }

  getSearch = async (query, page) => {
    // try {
    const res = await this.getResource(
      `/search/movie?${this._apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    )
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
