export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3'

  async getResource(url) {
    const res = await fetch(`${this._baseUrl}${url}`)

    if (!res.ok) {
      throw new Error(`Error ${url}, status ${res.status}`)
    }
    const body = await res.json()
    return body
  }

  async getDetail(id) {
    const res = await this.getResource(
      `/movie/${id}?api_key=a5bc79536e94cb8671d55c4b9eabb5f9`
    )
    return res
  }
}
