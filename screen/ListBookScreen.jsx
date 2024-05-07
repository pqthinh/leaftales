import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookItem from '../component/BookItem';
import { list_book, book_detail } from '../util/data/books'

const ListBook = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null);
      // const response = await fetch('https://your-api.com/books'); // Replace with your API endpoint
      // const data = await response.json();
      setBooks(list_book);
    };
    try {
      fetchBooks();
    } catch(err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, []);

  const handleBookPress = (bookId) => {
    const fetchBook = async (bookId) => {
      setIsLoading(true)
      setError(null);
      return book_detail;
    }
    try {
      const book = fetchBook(bookId);
      console.log(book)
      navigation.navigate('BookDetail', { ...book });
    } catch(err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
    
  };
  if (isLoading) {
    return <Text>Loading book details...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Book List</Text>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBookPress(item.id)}>
            <BookItem {...item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default ListBook;
