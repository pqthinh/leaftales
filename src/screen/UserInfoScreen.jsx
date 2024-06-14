import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import io from 'socket.io-client'
import { SOCKET_URL } from '../util/config'
import Icon from 'react-native-vector-icons/Ionicons'
import useCache from '../hooks/useCache'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const socket = io(SOCKET_URL)

const questions = [
    'Xin chào, bạn tên là gì?',
    'Bạn bao nhiêu tuổi?',
    'Bạn là nam hay nữ?',
    // 'Sở thích của bạn là gì?',
    // 'Thói quen của bạn là gì?',
    'Bạn thích đọc thể loại sách nào?',
    'Bạn thường có thời gian rảnh vào lúc nào?'
  ],
  keys = [
    'name',
    'age',
    'gender',
    // 'hobbies',
    // 'routine',
    'kind_of_book',
    'free_at'
  ]

const UserInfoScreen = () => {
  const { set, get } = useCache
  const navigation = useNavigation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const recording = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)

  useEffect(() => {
    if (currentQuestionIndex > questions.length - 1) return
    setTimeout(askQuestion, 500)
    socket.on('transcription', handleSpeechResult)

    return () => {
      socket.off('transcription')
    }
  }, [currentQuestionIndex, questions])

  useFocusEffect(
    React.useCallback(() => {
      async function stop() {
        await Speech.stop()
      }
      stop()
    }, [])
  )

  const askQuestion = () => {
    const question = questions[currentQuestionIndex]
    Speech.speak(question, { language: 'vi' })
  }

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') throw new Error('Permission not granted')

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })

      const { sound: alertSound } = await Audio.Sound.createAsync(
        require('../assets/sound/bubble-pop-up-alert-notification.wav')
      )
      await alertSound.playAsync()

      setIsMicActive(true)
      setIsRecording(true)
      recording.current = new Audio.Recording()
      await recording.current.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await recording.current.startAsync()
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  const stopRecording = async () => {
    try {
      const { sound: alertSound } = await Audio.Sound.createAsync(
        require('../assets/sound/bubble-pop-up-alert-notification.wav')
      )
      await alertSound.playAsync()

      setIsRecording(false)
      setIsMicActive(false) // Tắt hiệu ứng micro
      await recording.current.stopAndUnloadAsync()
      const uri = recording.current.getURI()
      const audioData = await fetch(uri)
      const blob = await audioData.blob()
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        socket.emit('audio-stream', { uri: base64data })
      }
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  const handleSpeechResult = text => {
    setIsLoading(true)

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [keys[currentQuestionIndex]]: text
    }))
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setIsLoading(false)
    if (currentQuestionIndex < questions.length -1) return
    Speech.speak(
      'Cảm ơn bạn đã cung cấp thông tin.\n Hệ thống sẽ đề xuất một số cuốn sách phù hợp với bạn.\n Xin vui lòng chờ trong giây lát!',
      { language: 'vi' }
    )
    setTimeout(async () => {
      console.log('Thông tin người dùng:', answers)
      await set('@app/get_user_info', {
        name: 'ThinhPQ10',
        age: 24,
        gender: 'Nam',
        ...answers
      })
      navigation.navigate('HomeStack')
    }, 10000)

  }

  return (
    <View style={styles.container}>
      {currentQuestionIndex < questions.length && (
        <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
      )}
      {(isLoading || currentQuestionIndex == questions.length) && (
        <ActivityIndicator size='large' color='#0000ff' />
      )}

      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.micButton}
      >
        <Icon
          name={isMicActive ? 'mic-circle' : 'mic-circle-outline'}
          size={80}
          color={isMicActive ? 'red' : 'black'}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  question: {
    fontSize: 24, // Tăng kích thước chữ cho dễ đọc
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold' // Làm chữ đậm hơn
  },
  micButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 30
  }
})

export default UserInfoScreen
