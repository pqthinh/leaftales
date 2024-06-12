import axios from './axios'
import {
  getBooks,
  setError,
  getBook,
  updateBook,
  deleteBook,
  setCurrentBook,
  setReadingStatus,
  setReadingSpeed,
  setVolume,
  setPitch,
  setRecognizedText,
  setAction,
  addBookmark,
  addNote,
  addToPlaylist,
  searchBooks,
  sortBooks
} from '../store/bookReducer'

export const getBooksApi = (params = async dispatch => {
  try {
    const params = {
      device_id: '1',
      author_name: '',
      category_name: '',
      book_name: '',
      offset_limit: 10
    }
    const data = await axios('/api/v1/book_info', params)
    if (data && data.data) {
      console.log(data.data)
      dispatch(getBooks(data.data))
    } else {
      console.log(data)
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log(error)
    dispatch(setError(data.message))
  }
})

export const getBookDetail = (params = async dispatch => {
  try {
    const params = {
      device_id: '1',
      book_id: '1',
      chapter_id: '1'
    }
    const data = await axios('/api/v1/book', params)
    if (data && data.data) {
      dispatch(getBooks(data.data))
    } else {
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log(error)
    dispatch(setError(data.message))
  }
})
