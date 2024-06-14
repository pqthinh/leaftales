import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import * as Speech from 'expo-speech'
import { getBookDetail } from '../api/book'

const BookReaderScreen = ({ route }) => {
  const book = route.params
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1)
  const [chapterContent, setChapterContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const params = {
        device_id: '1',
        book_id: book.id,
        chapter_id: currentChapterIndex
      }
      await getBookDetail(params)
      const currentBook = useSelector(state => state.currentBook)
      setChapterContent(currentBook.text)
      setIsLoading(false)
    }
    fetch()
  }, [currentChapterIndex])

  // useEffect(() => {
  //   const fetchChapterContent = async () => {
  //     try {
  //       const chapterId = book.chapters[currentChapterIndex]
  //       const response = await fetch(`YOUR_API_ENDPOINT/chapters/${chapterId}`)
  //       const data = await response.json()
  //       setChapterContent(data.content)
  //       setIsLoading(false)
  //     } catch (error) {
  //       console.error('Error fetching chapter content:', error)
  //       // Xử lý lỗi ở đây
  //     }
  //   }

  //   fetchChapterContent()
  // }, [currentChapterIndex])

  const handleSpeak = () => {
    Speech.speak(chapterContent, { language: 'vi' })
  }

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
      setIsLoading(true) // Hiển thị loading khi chuyển chương
    }
  }

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
      setIsLoading(true) // Hiển thị loading khi chuyển chương
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      <Text style={styles.title}>{book.name}</Text>
      <Text style={styles.author}>Tác giả: {book.author.name}</Text>
      <Text style={styles.description}>{book.description}</Text>

      {isLoading ? (
        <ActivityIndicator size='large' style={styles.loadingIndicator} />
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.chapterContent}>{chapterContent}</Text>
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePreviousChapter} style={styles.button}>
          <Text style={styles.buttonText}>Chương trước</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeak} style={styles.button}>
          <Text style={styles.buttonText}>Đọc</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextChapter} style={styles.button}>
          <Text style={styles.buttonText}>Chương sau</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff' // Nền trắng sáng
  },
  coverImage: {
    width: '100%',
    height: 200, // Điều chỉnh chiều cao theo ý muốn
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  author: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555' // Màu xám nhạt cho tác giả
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24 // Khoảng cách dòng rộng hơn
  },
  content: {
    flex: 1,
    padding: 20
  },
  chapterContent: {
    fontSize: 20,
    lineHeight: 30 // Khoảng cách dòng lớn hơn
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loadingIndicator: {
    marginTop: 20
  }
})

export default BookReaderScreen
