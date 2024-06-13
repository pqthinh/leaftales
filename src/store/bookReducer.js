import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  device_id: 1,
  books: [],
  currentBook: null,
  currentPage: 0,
  currentChapter: 0,
  isReading: false,
  readingSpeed: 1.0,
  volume: 1.0,
  pitch: 1.0,
  recognizedText: '',
  action: {},
  bookmarks: {},
  notes: {},
  playlist: [],
  isError: false,
  error: [],
  language: "vi",
  userInfo: {}
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    getBooks: (state, action) => {
      console.log("action in slice", action.payload.length)
      state.books = action.payload
      state.isError = false
      state.error=[]
    },
    setError: (state, action) => {
      state.isError= true
      state.error = action.payload
    },
    getBook: (state, action) => {
      state.currentBook = action.book;
      state.currentPage = action.currentPage||0;
      state.currentChapter = action.currentChapter||1;
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter(book => book.id !== action.payload.id);
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
      state.currentPage = 0;
      state.currentChapter = 1;
    },
    setReadingStatus: (state, action) => {
      state.isReading = action.payload;
    },
    setReadingSpeed: (state, action) => {
      state.readingSpeed = action.payload;
    },
    setVolume: (state, action) => {
      console.log("Volumn", action.payload)
      state.volume = action.payload;
    },
    setPitch: (state, action) => {
      state.pitch = action.payload;
    },
    setRecognizedText: (state, action) => {
      state.recognizedText = action.payload;
    },
    setAction: (state, action) => {
      state.action = action.payload;
    },
    addBookmark: (state, action) => {
      const { bookId, page } = action.payload;
      if (!state.bookmarks[bookId]) {
        state.bookmarks[bookId] = [];
      }
      state.bookmarks[bookId].push(page);
    },
    addNote: (state, action) => {
      const { bookId, word, definition } = action.payload;
      if (!state.notes[bookId]) {
        state.notes[bookId] = {};
      }
      state.notes[bookId][word] = definition;
    },
    addToPlaylist: (state, action) => {
      state.playlist.push(action.payload);
    },
    searchBooks: (state, action) => {
      state.searchResults = state.books.filter(book =>
        book.title.includes(action.payload) || book.author.includes(action.payload)
      );
    },
    sortBooks: (state, action) => {
      const { field, order } = action.payload;
      state.books.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    },
  },
});

export const {
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
  sortBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
