import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import BookItem from '../component/BookItem'
import { getBooksApi } from '../api/book'
import { useSelector, useDispatch  } from 'react-redux'

// const booksData = [
//   {
//     title: 'The Hitchhiker\'s Guide to the Galaxy',
//     author: 'Douglas Adams',
//     imageUrl: 'https://example.com/book1.jpg',
//   },
//   {
//     title: 'Pride and Prejudice',
//     author: 'Jane Austen',
//     imageUrl: 'https://example.com/book2.jpg',
//   },
//   {
//     title: 'To Kill a Mockingbird',
//     author: 'Harper Lee',
//     imageUrl: 'https://example.com/book3.jpg',
//   },
// ];

const HomeScreen = () => {
  const [booksData, setBooksData] = useState(
    useSelector(state => {
      console.log(state.books)
      return state.books
    })
  )
  // const booksData = useSelector((state) => state.books);
  const dispatch = useDispatch();

  useEffect(() => {
    getBooksApi()
  }, [booksData])
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Book List</Text>
      <FlatList
        data={booksData}
        renderItem={({ item }) => <BookItem {...item} />}
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
