import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native'
import * as Speech from 'expo-speech'
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

function UserInfoScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    askQuestion()
    socket.on('transcription', async text => {
      await handleSpeechResult(text)
    })

    return () => {
      socket.off('transcription')
    }
  }, [])

  async function askQuestion() {
    const question = questions[currentQuestionIndex]
    await Speech.speak(question, { language: 'vi' })
    setIsRecording(true)
  }

  async function handleSpeechResult(result) {
    setIsRecording(false)
    setIsLoading(true)

    try {
      const text = await convertSpeechToText(result.uri)
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionIndex]: text
      }))

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        askQuestion()
      } else {
        console.log('Thông tin người dùng:', answers)
        Speech.speak('Cảm ơn bạn đã cung cấp thông tin.', { language: 'vi' })
        // Chuyển hướng hoặc thực hiện hành động khác
      }
    } catch (error) {
      console.error('Lỗi khi chuyển đổi giọng nói:', error)
      Speech.speak('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.', {
        language: 'vi'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
      {isRecording && <ActivityIndicator size='large' color='#0000ff' />}
      {!isRecording && !isLoading && (
        <Button title='Trả lời' onPress={askQuestion} disabled={isLoading} />
      )}
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
  button: {
    backgroundColor: '#6200EE',
    color: '#fff',
    padding: 10,
    borderRadius: 5
  }
})

export default UserInfoScreen
