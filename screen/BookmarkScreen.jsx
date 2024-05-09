import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, AsyncStorage  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookmarkScreen = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);

  useEffect(() => {
    // Load bookmarked book IDs from storage (replace with your storage mechanism)
    const loadBookmarkedBooks = async () => {
      const storedIds = await AsyncStorage.getItem('bookmarkedBooks'); // Assuming AsyncStorage usage
      setBookmarkedBooks(storedIds ? JSON.parse(storedIds) : []);
    };

    loadBookmarkedBooks();
  }, []);

  const handleRemoveBookmark = (bookId) => {
    setBookmarkedBooks(bookmarkedBooks.filter(id => id !== bookId));
    // Update storage to remove bookmark (replace with your storage mechanism)
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
              {/* Assuming you have a BookItem component to display book details */}
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
