import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [], // Danh sách sách trong thư viện
  currentBook: null, // Sách đang được đọc
  currentPage: 0,
  currentChapter: 0,
  isReading: false,
  readingSpeed: 1.0, // Tốc độ đọc
  volume: 1.0, // Âm lượng
  pitch: 1.0, // Ngữ điệu
  recognizedText: '', // Văn bản từ nhận diện giọng nói
  action: {}, // action phân tích từ recognizedText dùng để điều hướng hoặc tìm kiếm call api ...
  bookmarks: {}, // Đánh dấu trang: { bookId: [page1, page2, ...] }
  notes: {}, // Ghi chú: { bookId: { word: definition } }
  playlist: [],
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
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
      state.currentChapter = 0;
    },
    setReadingStatus: (state, action) => {
      state.isReading = action.payload;
    },
    setReadingSpeed: (state, action) => {
      state.readingSpeed = action.payload;
    },
    setVolume: (state, action) => {
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
  addBook,
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
