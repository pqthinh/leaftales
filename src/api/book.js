import axios from './axios.js'
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
import store from '../store/store.js'

const { dispatch } = store

export const getBooksApi = async params => {
  try {
    const params = {
      device_id: '1',
      author_name: '',
      category_name: '',
      book_name: '',
      offset_limit: 10
    }
    const data = await axios.post('/api/v1/book_info', params)
    if (data && data.data) {
      const books = []
      data.data.forEach(bookData => {
        const { author, category, book } = bookData
        const newBookInfo = {
          id: book.BookId,
          name: book.BookName,
          coverImage: book.CoverImage,
          description: book.BookDescription,
          chapters: book.BookChapterName,
          author: {
            id: author.AuthorId,
            name: author.AuthorName,
            description: author.AuthorDescr
          },
          category: {
            id: category.CategoryID,
            name: category.CategoryName
          }
        }
        books.push(newBookInfo)
      })
      dispatch(getBooks(books))
    } else {
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log(error.message)
    dispatch(setError(data.message))
  }
}

export const getBookDetail = async params => {
  try {
    const params = {
      device_id: '1',
      book_id: '1',
      chapter_id: '1'
    }
    const data = await axios.post('/api/v1/book', params)
    if (data && data.data) {
      dispatch(getBooks(data.data))
    } else {
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log(error)
    dispatch(setError(data.message))
  }
}
