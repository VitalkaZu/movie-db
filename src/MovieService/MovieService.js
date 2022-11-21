export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3'

  _apiKey = 'api_key=a5bc79536e94cb8671d55c4b9eabb5f9'

  async getResource(url) {
    const res = await fetch(`${this._baseUrl}${url}`, { cache: 'no-store' })

    if (!res.ok) {
      throw new Error(`Error ${url}, status ${res.status}`)
    }
    const body = await res.json()
    return body
  }

  getDetail = async (id) => {
    const res = await this.getResource(`/movie/${id}?${this._apiKey}`)
    console.log(res)
    return res
  }

  async getPopular() {
    const res = await this.getResource(`/movie/popular?${this._apiKey}&page=1`)
    return res.results
  }

  async getSearch(query) {
    const res = await this.getResource(
      `/movie?${this._apiKey}&language=en-US&query=${query}&page=1&include_adult=false`
    )
    return res
  }

  getKeywords = async (id) => {
    const res = await this.getResource(`/movie/${id}/keywords?${this._apiKey}`)
    return res.keywords
  }
}
