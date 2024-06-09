import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BookItem = ({ title, author, imageUrl }) => (
  <View style={styles.bookItem}>
    <Image source={{ uri: imageUrl }} style={styles.bookImage} />
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
  },
});

export default BookItem;
