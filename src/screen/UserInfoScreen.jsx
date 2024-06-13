import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import io from 'socket.io-client'
import { SOCKET_URL } from '../util/config'

const socket = io(SOCKET_URL)

const questions = [
  'Xin chào, bạn tên là gì?',
  'Bạn bao nhiêu tuổi?',
  'Bạn là nam hay nữ?',
  'Sở thích của bạn là gì?',
  'Thói quen của bạn là gì?',
  'Bạn thích đọc thể loại sách nào?',
  'Bạn thường có thời gian rảnh vào lúc nào?'
]

const UserInfoScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [recording, setRecording] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    askQuestion()
    // socket.on('transcription', async (text) => {
    //   await handleSpeechResult(text);
    // });

    return () => {
      socket.off('transcription')
    }
  }, [])

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
      setIsRecording(true)
      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await recording.startAsync()
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err)
      throw err
    }
  }

  const stopRecording = async () => {
    try {
      setIsRecording(false)
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      const audioData = await fetch(uri)
      const blob = await audioData.blob()
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          socket.emit('audio-stream', { uri: base64data })
          socket.on('transcription', text => {
            resolve(text)
          })
          socket.on('error', error => {
            reject(error)
          })
        }
        reader.onerror = error => {
          reject(error)
        }
      })
    } catch (err) {
      console.error('Failed to stop recording', err)
      throw err
    }
  }

  const askQuestion = () => {
    const question = questions[currentQuestionIndex]
    Speech.speak(question, { language: 'vi' })
  }

  const handleSpeechResult = async text => {
    setIsLoading(true)
    try {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionIndex]: text
      }))

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        console.log('Thông tin người dùng:', answers)
        Speech.speak('Cảm ơn bạn đã cung cấp thông tin.', { language: 'vi' })
      }
    } catch (error) {
      console.error('Lỗi khi chuyển đổi giọng nói:', error)
      Speech.speak('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.', {
        language: 'vi'
      })
    } finally {
      setIsLoading(false)
      askQuestion()
    }
  }

  const handleStopRecording = async () => {
    if (recording) {
      try {
        const text = await stopRecording()
        console.log('handleStopRecording', text)
        await handleSpeechResult(text)
        setRecording(null)
      } catch (err) {
        console.error('Failed to stop recording', err)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
      {isLoading && <ActivityIndicator size='large' color='#0000ff' />}
      <View style={styles.containerButtonMic}>
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={async () =>
            isRecording ? await handleStopRecording() : await startRecording()
          }
          color='#6200EE'
        />
      </View>
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
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  containerButtonMic: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default UserInfoScreen
