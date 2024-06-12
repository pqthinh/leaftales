import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://wemarket-api.herokuapp.com/api'
})

export default instance