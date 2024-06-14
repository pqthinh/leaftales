import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { getBookDetail } from '../api/book'
import useBookReader from '../hooks/useBookReader'
import { useFocusEffect } from '@react-navigation/native'
import * as Speech from 'expo-speech'

const BookReaderScreen = ({ route }) => {
  const book = route.params
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1)
  const [bookChapterContent, setBookChapterContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    const fetchChapterContent = async () => {
      try {
        const params = {
          device_id: '1',
          book_id: `${book.id}`,
          chapter_id: `${currentChapterIndex}`
        }
        const res = await getBookDetail(params)
        setBookChapterContent(res.content)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching chapter content:', error)
      }
    }

    fetchChapterContent()
  }, [currentChapterIndex])

  const {
    sentences,
    currentSentenceIndex,
    playbackState,
    speechRate,
    volume,
    speakCurrentSentence,
    speakNextSentence,
    speakPreviousSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    adjustSpeed,
    adjustVolume,
    goToSentence,
    getProgressPercentage
  } = useBookReader(bookChapterContent)

  const scrollViewRef = useRef(null)
  const sentenceRefs = useRef([])

  useFocusEffect(
    React.useCallback(() => {
      async function stop() {
        await Speech.stop()
        stopSpeech()
      }
      stop()
    }, [])
  )

  useEffect(() => {
    console.log('currentSentenceIndex: ----> ', currentSentenceIndex)
    speakCurrentSentence()
    if (!isLoading && scrollViewRef.current) {
      sentenceRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.measureLayout(
            scrollViewRef.current,
            (x, y, width, height) => {
              sentenceRefs.current[index].layout = { x, y, width, height }
            },
            error => console.log('Error measuring sentence:', error)
          )
        }
      })
    }
    scrollToCurrentSentence()
    return () => {
      stopSpeech()
    }
  }, [currentChapterIndex, currentSentenceIndex, sentences, sentenceRefs, scrollViewRef, isLoading])

  const scrollToCurrentSentence = useCallback(() => {
    if (scrollViewRef.current && sentences[currentSentenceIndex]?.y) {
      scrollViewRef.current.scrollTo({
        y: sentences[currentSentenceIndex].y,
        animated: true
      })
    }
  }, [currentChapterIndex, currentSentenceIndex, sentences, sentenceRefs, scrollViewRef])

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
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
        <View style={styles.content}>
          <ScrollView style={styles.content} ref={scrollViewRef}>
            {sentences.map((sentence, index) => (
              <Text
                key={index}
                ref={ref => (sentenceRefs.current[index] = ref)}
                style={[
                  styles.chapterContent,
                  index === currentSentenceIndex && styles.currentSentence
                ]}
              >
                {sentence}
              </Text>
            ))}
          </ScrollView>
          <Text style={styles.progress}>
            Tiến độ: {getProgressPercentage()}%
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={speakPreviousSentence}
              style={styles.controlButton}
            >
              <Icon name='play-back' size={30} color='black' />
            </TouchableOpacity>
            {playbackState === 'playing' ? (
              <TouchableOpacity
                onPress={pauseSpeech}
                style={styles.controlButton}
              >
                <Icon name='pause' size={30} color='black' />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={
                  playbackState === 'stopped'
                    ? speakCurrentSentence
                    : resumeSpeech
                }
                style={styles.controlButton}
              >
                <Icon name='play' size={30} color='black' />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={speakNextSentence}
              style={styles.controlButton}
            >
              <Icon name='play-forward' size={30} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustVolume(volume + 0.1)}
              style={styles.controlButton}
            >
              <Icon name='volume-high' size={30} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustVolume(Math.max(0, volume - 0.1))}
              style={styles.controlButton}
            >
              <Icon name='volume-low' size={30} color='black' />
            </TouchableOpacity>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => adjustSpeed(Math.max(0.5, speechRate - 0.1))}
              style={styles.controlButton}
            >
              <Icon name='walk' size={30} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustSpeed(1.0)}
              style={styles.controlButton}
            >
              <Icon name='speedometer' size={30} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustSpeed(Math.min(2.0, speechRate + 0.1))}
              style={styles.controlButton}
            >
              <Icon name='rocket' size={30} color='black' />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePreviousChapter}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Chương trước</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNextChapter} style={styles.button}>
              <Text style={styles.buttonText}>Chương sau</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff'
    padding: 10
  },
  coverImage: {
    width: 100,
    height: 150,
    padding: 5
  },
  bookDetails: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  author: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555' // Màu xám nhạt cho tác giả
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 20
  },
  content: {
    flex: 1
  },
  chapterContent: {
    fontSize: 18
  },
  currentSentence: {
    fontWeight: 'bold',
    color: '#007BFF' // Màu xanh dương nổi bật
  },
  progress: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  controlButton: {
    padding: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
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
    marginRight: 10
  },
  bookDetails: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  }
})

export default BookReaderScreen
