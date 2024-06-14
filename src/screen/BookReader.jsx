import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import * as Speech from 'expo-speech'
import { getBookDetail } from '../api/book'
// import { useSelector } from 'react-redux'
import useBookReader from '../hooks/useBookReader'
import { Button } from 'react-native-paper'

const BookReaderScreen = ({ route }) => {
  const book = route.params
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1)
  const [chapterContent, setChapterContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [bookReader, setBookReader] = useState(useBookReader(chapterContent))

  useEffect(() => {
    async function fetch() {
      const params = {
        device_id: '1',
        book_id: `${book.id}`,
        chapter_id: `${currentChapterIndex}`
      }
      const res = await getBookDetail(params)
      // const chapterContent = useSelector(state => {
      //   console.log(state)
      //   return state.chapterContent
      // })
      setChapterContent(res.content)
      setIsLoading(false)
    }
    fetch()
  }, [currentChapterIndex])
  useEffect(() => {
    const hookRead = useBookReader(chapterContent)
    setBookReader(hookRead)
    // {
    //   sentences,
    //   currentSentenceIndex,
    //   playbackState,
    //   speechRate,
    //   volume,
    //   speakNextSentence,
    //   speakPreviousSentence,
    //   pauseSpeech,
    //   resumeSpeech,
    //   stopSpeech,
    //   adjustSpeed,
    //   adjustVolume,
    //   goToSentence,
    //   getProgressPercentage,
    // }
  }, [bookReader, chapterContent])

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const handleSpeak = () => {
    Speech.speak(chapterContent, { language: 'vi' })
  }

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
      setIsLoading(true)
    }
  }

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
      setIsLoading(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.bookInfoContainer}>
        <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
        <View style={styles.bookDetails}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>
            {book.name}
          </Text>
          <Text style={styles.author}>Tác giả: {book.author.name}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={toggleDescription}>
        <Text style={styles.description}>
          {showFullDescription
            ? book.description
            : `${book.description.substring(0, 100)}...`}
          <Text style={styles.seeMoreText}>
            {showFullDescription ? ' Thu gọn' : ' Xem thêm'}
          </Text>
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>{`Chương ${currentChapterIndex}: `}</Text>
      {isLoading ? (
        <ActivityIndicator size='large' style={styles.loadingIndicator} />
      ) : (
        <ScrollView style={styles.content}>
          {/* <Text style={styles.chapterContent}>{chapterContent}</Text> */}
          {bookReader.sentences.map((sentence, index) => (
            <Text
              key={index}
              style={[
                styles.chapterContent,
                index === bookReader.currentSentenceIndex &&
                  styles.currentSentence
              ]}
            >
              {sentence}
            </Text>
          ))}
        </ScrollView>
      )}

      <Text style={styles.progress}>
        Tiến độ: {bookReader.getProgressPercentage()}%
      </Text>
      <View style={styles.controls}>
        <Button icon='rewind' onPress={bookReader.speakPreviousSentence} />
        {bookReader.playbackState === 'playing' ? (
          <Button icon='pause' onPress={bookReader.pauseSpeech} />
        ) : (
          <Button icon='play' onPress={bookReader.speakNextSentence} />
        )}
        <Button icon='fast-forward' onPress={bookReader.speakNextSentence} />
        <Button
          icon='volume-high'
          onPress={() => bookReader.adjustVolume(bookReader.volume + 0.1)}
        />
        <Button
          icon='volume-low'
          onPress={() =>
            bookReader.adjustVolume(Math.max(0, bookReader.volume - 0.1))
          }
        />
      </View>
      <View style={styles.controls}>
        <Button
          icon='speedometer-slow'
          onPress={() =>
            bookReader.adjustSpeed(Math.max(0.5, bookReader.speechRate - 0.1))
          }
        />
        <Button
          icon='speedometer'
          onPress={() => bookReader.adjustSpeed(1.0)}
        />
        <Button
          icon='speedometer-fast'
          onPress={() =>
            bookReader.adjustSpeed(Math.min(2.0, bookReader.speechRate + 0.1))
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePreviousChapter} style={styles.button}>
          <Text style={styles.buttonText}>Chương trước</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeak} style={styles.button}>
          <Text style={styles.buttonText}>Đọc</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextChapter} style={styles.button}>
          <Text style={styles.buttonText}>Chương sau</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 10
  },
  coverImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  author: {
    fontSize: 18,
    // textAlign: 'center',
    marginBottom: 10,
    color: '#555' // Màu xám nhạt cho tác giả
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24 // Khoảng cách dòng rộng hơn
  },
  content: {
    flex: 1
  },
  chapterContent: {
    fontSize: 20,
    lineHeight: 30 // Khoảng cách dòng lớn hơn
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loadingIndicator: {
    marginTop: 20
  },
  bookInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  coverImage: {
    width: 80,
    height: 100,
    marginRight: 10 // Khoảng cách giữa ảnh bìa và thông tin sách
  },
  bookDetails: {
    flex: 1 // Cho phép phần thông tin sách chiếm không gian còn lại
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  }
})

export default BookReaderScreen
