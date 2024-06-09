import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const SearchScreen = () => {
  const navigation = useNavigation()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v3/volumes?q=${searchTerm}`
        ) // Replace with your API endpoint
        const data = await response.json()
        const bookItems = data.items?.map(item => ({
          id: item.id, // Unique identifier for the book (replace with your actual property)
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', '), // Assuming authors are an array
          imageUrl: item.volumeInfo.imageLinks?.thumbnail // Assuming thumbnail image URL is available
        }))
        setSearchResults(bookItems || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (searchTerm.trim()) {
      fetchBooks()
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const handleBookPress = bookId => {
    navigation.navigate('BookDetail', { bookId })
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search for books'
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBookPress(item.id)}>
              <Text style={styles.bookItem}>
                {item.title} - {item.author}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text>No books found.</Text>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  searchInput: {
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 15
  },
  bookItem: {
    fontSize: 16,
    marginBottom: 10
  },
  flatListContent: {
    paddingBottom: 20
  }
})

export default SearchScreen
