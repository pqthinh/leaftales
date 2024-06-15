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
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import speakResult from '../util/speakResult'
import { VoiceControlComponent } from '../component/VoiceControl'
import * as Speech from 'expo-speech'

const BookReaderScreen = ({ route }) => {
  const navigation = useNavigation()
  const book = route.params
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1)
  const [bookChapterContent, setBookChapterContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const [sentences, setSentences] = useState([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [playbackState, setPlaybackState] = useState('stopped')
  const [speechRate, setSpeechRate] = useState(1.0)
  const [volume, setVolume] = useState(1.0)

  const scrollViewRef = useRef(null)
  const sentenceRefs = useRef([])

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
  }, [currentChapterIndex, book.id])

  useEffect(() => {
    if (bookChapterContent) {
      const newSentences = bookChapterContent
        .split(/[.?!;]/)
        .filter(sentence => sentence.trim() !== '')
      setSentences(newSentences)
      setCurrentSentenceIndex(0)
      setPlaybackState('stopped')
      stopSpeech()
    }
  }, [bookChapterContent, currentChapterIndex])

  const speak = useCallback(
    sentence => {
      Speech.speak(sentence, {
        language: 'vi',
        rate: speechRate,
        volume: volume,
        onDone: () => {
          //   console.log(currentSentenceIndex, sentences.length)
          if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(prevIndex => {
              // speakCurrentSentence()
              speak(sentences[prevIndex + 1])
              return prevIndex + 1
            })
            // speakCurrentSentence()
          } else {
            setPlaybackState('stopped')
          }
        },
        onStopped: () => setPlaybackState('stopped'),
        onError: () => setPlaybackState('stopped')
      })
    },
    [
      currentChapterIndex,
      currentSentenceIndex,
      sentences,
      speechRate,
      volume,
      speakCurrentSentence
    ]
  )

  const speakCurrentSentence = useCallback(() => {
    console.log(currentSentenceIndex, sentences)
    if (currentSentenceIndex < sentences.length) {
      speak(sentences[currentSentenceIndex])
      setPlaybackState('playing')
    }
  }, [bookChapterContent, currentChapterIndex, currentSentenceIndex, sentences])

  const pauseSpeech = useCallback(async () => {
    // await Speech.pause()
    await Speech.stop()
    setPlaybackState('paused')
  }, [bookChapterContent, currentChapterIndex, currentSentenceIndex, sentences, playbackState])

  const resumeSpeech = useCallback(async () => {
    // await Speech.resume()
    speakCurrentSentence()
    setPlaybackState('playing')
  }, [
    currentChapterIndex,
    currentSentenceIndex,
    sentences,
    playbackState,
    speakCurrentSentence
  ])

  const stopSpeech = useCallback(async () => {
    await Speech.stop()
    setPlaybackState('stopped')
  }, [])

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSpeech()
      }
    }, [stopSpeech])
  )

  useEffect(() => {
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
  }, [bookChapterContent, currentChapterIndex, currentSentenceIndex, sentences, isLoading])

  const scrollToCurrentSentence = useCallback(() => {
    if (
      scrollViewRef.current &&
      sentenceRefs.current[currentSentenceIndex]?.layout
    ) {
      scrollViewRef.current.scrollTo({
        y: sentenceRefs.current[currentSentenceIndex].layout.y,
        animated: true
      })
    }
  }, [bookChapterContent, currentChapterIndex, currentSentenceIndex])

  const toggleDescription = useCallback(() => {
    setShowFullDescription(prevState => !prevState)
  }, [])

  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < book.chapters.length) {
      setCurrentChapterIndex(prevIndex => prevIndex + 1)
      setIsLoading(true)
    }
  }, [bookChapterContent, currentChapterIndex])

  const handlePreviousChapter = useCallback(() => {
    if (currentChapterIndex > 1) {
      setCurrentChapterIndex(prevIndex => prevIndex - 1)
      setIsLoading(true)
    }
  }, [bookChapterContent, currentChapterIndex])

  const getProgressPercentage = useCallback(() => {
    return Math.round((currentSentenceIndex / sentences.length) * 100)
  }, [bookChapterContent, currentChapterIndex, currentSentenceIndex, sentences])

  const handleUserCommandReadingBook = useCallback(
    command => {
      const lowerCaseCommand = command.toLowerCase()
      console.log('lowerCaseCommand', lowerCaseCommand)
      if (lowerCaseCommand.includes('tăng âm lượng')) {
        adjustVolume(Math.min(1.0, volume + 0.1))
        speakResult('Đã tăng âm lượng')
      } else if (lowerCaseCommand.includes('giảm âm lượng')) {
        adjustVolume(Math.max(0, volume - 0.1))
        speakResult('Đã giảm âm lượng')
      } else if (lowerCaseCommand.includes('dừng đọc')) {
        stopSpeech()
        speakResult('Đã dừng đọc')
      } else if (lowerCaseCommand.includes('bắt đầu đọc')) {
        speakCurrentSentence()
        speakResult('Bắt đầu đọc')
      } else if (lowerCaseCommand.includes('đọc tiếp')) {
        if (playbackState === 'paused') {
          resumeSpeech()
          speakResult('Đọc tiếp')
        } else {
          speakCurrentSentence()
          speakResult('Bắt đầu đọc')
        }
      } else if (lowerCaseCommand.includes('đọc lại')) {
        speakCurrentSentence()
        speakResult('Đọc lại câu hiện tại')
      } else if (lowerCaseCommand.includes('mở chương')) {
        const chapterNumberMatch = lowerCaseCommand.match(/chương (\d+)/)
        if (chapterNumberMatch) {
          const chapterNumber = parseInt(chapterNumberMatch[1], 10)
          if (chapterNumber >= 1 && chapterNumber <= book.chapters.length) {
            setCurrentChapterIndex(chapterNumber)
            speakResult(`Đang mở chương ${chapterNumber}`)
          } else {
            speakResult('Chương không tồn tại')
          }
        } else {
          speakResult('Không hiểu câu lệnh. Vui lòng thử lại.')
        }
      } else if (lowerCaseCommand.includes('chương trước')) {
        handlePreviousChapter()
        speakResult('Đang chuyển sang chương trước')
      } else if (lowerCaseCommand.includes('chương sau')) {
        handleNextChapter()
        speakResult('Đang chuyển sang chương sau')
      } else if (lowerCaseCommand.includes('tăng tốc độ')) {
        adjustSpeed(Math.min(2.0, speechRate + 0.1))
        speakResult('Đã tăng tốc độ đọc')
      } else if (lowerCaseCommand.includes('giảm tốc độ')) {
        adjustSpeed(Math.max(0.5, speechRate - 0.1))
        speakResult('Đã giảm tốc độ đọc')
      } else if (lowerCaseCommand.includes('quay lại')) {
        navigation.goBack()
        speakResult('Quay lại màn hình trước')
      } else if (lowerCaseCommand.includes('chuyển đến')) {
        if (
          lowerCaseCommand.includes('playlist') ||
          lowerCaseCommand.includes('lịch sử') ||
          lowerCaseCommand.includes('danh sách')
        ) {
          navigation.navigate('PlayList')
        } else if (
          lowerCaseCommand.includes('trang chủ') ||
          lowerCaseCommand.includes('đề xuất') ||
          lowerCaseCommand.includes('gợi ý')
        ) {
          navigation.navigate('HomeScreen')
        } else if (lowerCaseCommand.includes('cài đặt')) {
          navigation.navigate('SettingScreen')
        } else if (lowerCaseCommand.includes('tra cứu')) {
          navigation.navigate('Search')
        }
      } else if (lowerCaseCommand.includes('lưu sách')) {
        setPlaylist([...playlist, book])
        speakResult('Đã lưu sách vào playlist')
      } else if (lowerCaseCommand.includes('xem playlist')) {
        if (playlist.length === 0) {
          speakResult('Playlist trống')
        } else {
          const playlistNames = playlist.map(book => book.name).join(', ')
          speakResult(`Danh sách sách yêu thích của bạn: ${playlistNames}`)
        }
      } else if (lowerCaseCommand.includes('xóa playlist')) {
        setPlaylist([])
        speakResult('Đã xóa playlist')
      } else {
        // speakResult('Không hiểu câu lệnh. Vui lòng thử lại.')
      }
    },
    [currentChapterIndex, currentSentenceIndex, sentences, speak]
  )

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

          <View style={styles.controlContainer}>
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => {
                  if (currentSentenceIndex > 0) {
                    setCurrentSentenceIndex(prevIndex => prevIndex - 1)
                  }
                }}
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
                onPress={() => {
                  if (currentSentenceIndex < sentences.length - 1) {
                    setCurrentSentenceIndex(prevIndex => prevIndex + 1)
                  }
                }}
                style={styles.controlButton}
              >
                <Icon name='play-forward' size={30} color='black' />
              </TouchableOpacity>
            </View>

            <View style={styles.verticalControls}>
              <TouchableOpacity
                onPress={() => setVolume(volume + 0.1)}
                style={styles.controlButton}
              >
                <Icon name='volume-high' size={30} color='black' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVolume(volume - 0.1)}
                style={styles.controlButton}
              >
                <Icon name='volume-low' size={30} color='black' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSpeechRate(Math.max(0.5, speechRate - 0.1))}
                style={styles.controlButton}
              >
                <Icon name='walk' size={30} color='black' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSpeechRate(1.0)}
                style={styles.controlButton}
              >
                <Icon name='speedometer' size={30} color='black' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSpeechRate(Math.min(2.0, speechRate + 0.1))}
                style={styles.controlButton}
              >
                <Icon name='rocket' size={30} color='black' />
              </TouchableOpacity>
            </View>
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
      <View style={{ height: 0 }}>
        <VoiceControlComponent
          handleUserCommand={handleUserCommandReadingBook}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#555'
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 20
  },
  seeMoreText: {
    color: '#007BFF'
  },
  content: {
    flex: 1
  },
  chapterContent: {
    fontSize: 18
  },
  currentSentence: {
    fontWeight: 'bold',
    color: '#007BFF'
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
  },
  verticalControls: {
    position: 'absolute',
    right: 0,
    bottom: 200,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 50
  },
  controlButton: {
    padding: 10
  }
})

export default BookReaderScreen
