import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import BookItem from '../component/BookItem';

const booksData = [
  {
    title: 'The Hitchhiker\'s Guide to the Galaxy',
    author: 'Douglas Adams',
    imageUrl: 'https://example.com/book1.jpg',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    imageUrl: 'https://example.com/book2.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    imageUrl: 'https://example.com/book3.jpg',
  },
];

const HomeScreen = () => {
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
  }
});

export default HomeScreen;
