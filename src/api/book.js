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
import speakResult from '../util/speakResult.js'
const { dispatch } = store

export const getBooksApi = async params => {
  try {
    const p = {
      device_id: '1',
      author_name: '',
      category_name: '',
      book_name: '',
      offset_limit: 10
    }
    const data = await axios.post('/api/v1/book_info', { ...p, ...params })
    if (data && data.data) {
      const books = [],
        speakBook = []
      data.data.forEach((bookData, index) => {
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
        speakBook.push(
          `${index + 1} - Sách ${book.BookName} của tác giả ${
            author.AuthorName
          } \n `
        )
      })
      dispatch(getBooks(books))
      speakResult(speakBook.join(speakBook))
    } else {
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log('Get books api has error: ---> ', error.message)
    dispatch(setError(data.message))
  }
}

export const getBookDetail = async params => {
  try {
    const p = {
      device_id: '1',
      book_id: '1',
      chapter_id: '1'
    }
    const data = await axios.post('/api/v1/book', { ...p, ...params })
    if (data && data.data) {
      dispatch(getBooks(data.data))
    } else {
      dispatch(setError(data.error))
    }
  } catch (error) {
    console.log('getBookDetail error: --->>>', error)
    dispatch(setError(data.message))
  }
}
