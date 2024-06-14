import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Audio } from 'expo-av'
import io from 'socket.io-client'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { handleUserCommand } from '../util/voiceCommand'
import { SOCKET_URL } from '../util/config'

const socket = io(SOCKET_URL)

export const VoiceControlComponent = () => {
  const navigation = useNavigation()
  const [recording, setRecording] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isMicActive, setIsMicActive] = useState(false)

  useEffect(() => {
    socket.on('transcription', async text => {
      setTranscription(JSON.stringify(text))
      await handleUserCommand(text, navigation)
    })

    return () => {
      socket.off('transcription')
    }
  }, [])

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') return

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })
      const { sound: alertSound } = await Audio.Sound.createAsync(
        require('../assets/sound/bubble-pop-up-alert-notification.wav') // Đường dẫn tới file âm thanh
      )
      await alertSound.playAsync()
      setIsMicActive(true)
      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await recording.startAsync()
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  const stopRecording = async () => {
    const { sound: alertSound } = await Audio.Sound.createAsync(
      require('../assets/sound/bubble-pop-up-alert-notification.wav') // Đường dẫn tới file âm thanh
    )
    await alertSound.playAsync()

    if (!recording) return
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      // const { sound, status } = await recording.createNewLoadedSoundAsync();
      const audioData = await fetch(uri)
      const blob = await audioData.blob()
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        socket.emit('audio-stream', { uri: base64data })
        //   socket.emit('audio-stream-end', {});
      }
      setIsMicActive(false)
      setRecording(null)
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  const controlNavigate = () => {
    // navigation.navigate("BookDetail", { recordingName: 'Ghi âm mới' })
    navigation.navigate('PlayList', { recordingName: 'Ghi âm mới' })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={styles.micButton}
      >
        <Icon
          name={isMicActive ? 'mic-circle' : 'mic-circle-outline'}
          size={80}
          color={isMicActive ? 'red' : 'black'}
        />
      </TouchableOpacity>
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  micButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 5
  },
  transcription: {
    position: 'absolute',
    bottom: 5
  }
})
