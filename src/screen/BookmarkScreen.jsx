import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookmarkScreen = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);

  useEffect(() => {
    const loadBookmarkedBooks = async () => {
      const storedIds = await AsyncStorage.getItem('bookmarkedBooks');
      setBookmarkedBooks(storedIds ? JSON.parse(storedIds) : []);
    };

    loadBookmarkedBooks();
  }, []);

  const handleRemoveBookmark = (bookId) => {
    setBookmarkedBooks(bookmarkedBooks.filter(id => id !== bookId));
    AsyncStorage.setItem('bookmarkedBooks', JSON.stringify(bookmarkedBooks.filter(id => id !== bookId)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bookmarks</Text>
      {bookmarkedBooks.length > 0 ? (
        <FlatList
          data={bookmarkedBooks}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <BookItem bookId={item} onRemoveBookmark={() => handleRemoveBookmark(item)} />
            </View>
          )}
          keyExtractor={item => item}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text>No books bookmarked yet.</Text>
      )}
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

export default BookmarkScreen;
