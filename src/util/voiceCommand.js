import store from '../store/store.js'
import speakResult from '../util/speakResult.js'
const { dispatch } = store // Nếu sử dụng React Navigation
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

export const handleUserCommand = async (command, navigation) => {
  console.log('handleUserCommand ->>>>', command)
  const lowerCaseCommand = command.toLowerCase() // Chuyển câu lệnh về chữ thường để so sánh dễ dàng hơn

  if (lowerCaseCommand.includes('tăng âm lượng')) {
    dispatch(setVolume(0.3)) // Gửi action tăng âm lượng (Redux)
    speakResult('Đã tăng âm lượng', 'success')
  } else if (lowerCaseCommand.includes('giảm âm lượng')) {
    dispatch({ type: 'DECREASE_VOLUME' }) // Gửi action giảm âm lượng (Redux)
    speakResult('Đã giảm âm lượng', 'success')
  } else if (lowerCaseCommand.includes('quay lại')) {
    navigation.goBack() // Quay lại màn hình trước đó (React Navigation)
  } else if (lowerCaseCommand.includes('chuyển đến')) {
    const screenName = extractScreenName(lowerCaseCommand) // Hàm trích xuất tên màn hình từ câu lệnh
    if (screenName) {
      navigation.navigate(screenName)
      speakResult(`Đang chuyển đến ${screenName}`, 'success')
    } else {
      speakResult('Không hiểu câu lệnh. Vui lòng thử lại.', 'error')
    }
  } else if (lowerCaseCommand.includes('tìm sách')) {
    const searchQuery = extractSearchQuery(lowerCaseCommand) // Hàm trích xuất từ khóa tìm kiếm
    if (searchQuery) {
      const searchResults = await searchBooksAPI(searchQuery) // Gọi API tìm kiếm sách
      // Xử lý kết quả tìm kiếm và hiển thị lên màn hình
      speakResult(`Tìm thấy ${searchResults.length} kết quả.`, 'success')
    } else {
      speakResult('Không hiểu câu lệnh. Vui lòng thử lại.', 'error')
    }
  } else {
    speakResult('Không hiểu câu lệnh. Vui lòng thử lại.', 'error')
  }
}

// Hàm trích xuất tên màn hình (ví dụ: 'trang chủ', 'cài đặt')
export const extractScreenName = async (command, navigation) => {
  // ...
}

// Hàm trích xuất từ khóa tìm kiếm
export const extractSearchQuery = async (command, navigation) => {
  // ...
}

// Hàm gọi API tìm kiếm sách (bạn cần tự triển khai)
export const searchBooksAPI = async (command, navigation) => {
  // ...
}
