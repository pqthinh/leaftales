import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import BookItem from '../component/BookItem'
import { getBooksApi } from '../api/book'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [booksData, setBooksData] = useState(useSelector(state => state.books))

  useEffect(() => {
    async function fetch() {
      await getBooksApi()
      const books = useSelector(state => state.books)
      setBooksData(books)
    }
    fetch()
  }, [])
  const onBookPress = item => {
    console.log('list book content: ----> ', item)
    navigation.navigate('BookDetail', { ...item })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đề xuất dành cho bạn:</Text>
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

export default HomeScreen
