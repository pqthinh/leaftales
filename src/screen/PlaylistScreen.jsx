import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import BookItem from '../component/BookItem'
import { getBooksApi } from '../api/book'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { readBookDetail } from '../store/bookReducer'
import { VoiceControlComponent } from '../component/VoiceControl'
import speakResult from '../util/speakResult'
import * as Speech from 'expo-speech'

const PlaylistScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [booksData, setBooksData] = useState(useSelector(state => state.books))

  useEffect(() => {
    async function fetch() {
      await getBooksApi()
      const books = useSelector(state => state.books)
      setBooksData(books)
    }
    fetch()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      async function stop() {
        Speech.stop()
      }
      stop()
    }, [])
  )

  const onBookPress = item => {
    dispatch(readBookDetail(item))
    navigation.navigate('BookDetail', { ...item })
  }

  const handleUserCommandReadingBook = command => {
    const lowerCaseCommand = command.toLowerCase()
    if (lowerCaseCommand.includes('đọc')) {
      const book = lowerCaseCommand.match(/số (\d+)/)
      if (book && book.length > 0) {
        const book_id = parseInt(book[1], 10)
        if (book_id >= 1 && book_id <= booksData.length) {
          speakResult(`Đang mở sách số ${book_id}`)
          let item = booksData[book_id - 1]
          dispatch(readBookDetail(item))
          navigation.navigate('BookDetail', { ...item })
        } else {
          speakResult('Thứ tự sách không tồn tại', 'error')
        }
      }
    } else if (
      lowerCaseCommand.includes('trang chủ') ||
      lowerCaseCommand.includes('đề xuất') ||
      lowerCaseCommand.includes('gợi ý')
    ) {
      navigation.navigate('HomeScreen')
    } else if (lowerCaseCommand.includes('chuyển')||lowerCaseCommand.includes('mở')) {
      if (
        lowerCaseCommand.includes('playlist') ||
        lowerCaseCommand.includes('lịch sử') ||
        lowerCaseCommand.includes('danh sách')
      ) {
        navigation.navigate('PlayList')
      } else if (
        lowerCaseCommand.includes('trang chủ') ||
        lowerCaseCommand.includes('đề xuất') ||
        lowerCaseCommand.includes('gợi ý')
      ) {
        navigation.navigate('HomeScreen')
      } else if (lowerCaseCommand.includes('cài đặt')) {
        navigation.navigate('SettingScreen')
      } else if (lowerCaseCommand.includes('tra cứu')) {
        navigation.navigate('Search')
      }
    } else if (lowerCaseCommand.includes('quay lại')||lowerCaseCommand.includes('trở về')) {
      
      navigation.goBack()
    } 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danh sách phát của bạn:</Text>
      <FlatList
        data={booksData}
        renderItem={({ item }) => (
          <BookItem
            name={item.name}
            author={item.author.name}
            coverImage={item.coverImage}
            onBookPress={() => onBookPress(item)}
            key={item.id + item.name + item.coverImage}
          />
        )}
        keyExtractor={item => item.id + item.name + item.coverImage}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={{ height: 0 }}>
        <VoiceControlComponent
          handleUserCommand={handleUserCommandReadingBook}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  heading: {
    fontSize: 24,
    marginBottom: 10
  },
  flatListContent: {
    paddingBottom: 20
  }
})

export default PlaylistScreen
