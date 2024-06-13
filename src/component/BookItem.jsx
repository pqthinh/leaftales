import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Speech from 'expo-speech';

const BookItem = ({ name, author, coverImage, onBookPress }) => {
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPress = () => {
    Speech.speak(`Tên sách: ${name}. Tác giả: ${author}`, { language: 'vi' }); // Đọc tiếng Việt
    setIsLongPressing(true);
  };

  const handleLongPressOut = () => {
    Speech.stop();
    setIsLongPressing(false);
  };

  return (
    <TouchableOpacity 
      onPress={onBookPress} 
      onLongPress={handleLongPress}
      onPressOut={handleLongPressOut}
      delayLongPress={500}
      activeOpacity={isLongPressing ? 1 : 0.7}
    >
      <View style={styles.bookItem}>
        <Image source={{ uri: coverImage }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{name}</Text>
          <Text style={styles.bookAuthor}>{author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
