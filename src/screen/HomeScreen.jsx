import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import BookItem from '../component/BookItem'
import { getBooksApi } from '../api/book'
import { useSelector } from 'react-redux'

const HomeScreen = () => {
  const [booksData, setBooksData] = useState(useSelector(state => state.books))

  useEffect(() => {
    async function fetch() {
      await getBooksApi()
      const books = useSelector(state => state.books)
      setBooksData(books)
    }
    fetch()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Book List</Text>
      <FlatList
        data={booksData}
        renderItem={({ item }) => (
          <BookItem
            name={item.name}
            author={item.author.name}
            coverImage={item.coverImage}
            key={item.id}
          />
        )}
        keyExtractor={item => item.title}
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
