import axios from 'axios'
import {BACKEND_URL} from '../util/config'

const instance = axios.create({
  baseURL: BACKEND_URL
})

export default instance