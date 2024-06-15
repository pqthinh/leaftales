import React, { useState, useEffect } from 'react'
import { View, Button, Text } from 'react-native'
import { Audio } from 'expo-av'
import io from 'socket.io-client'

const socket = io('http://192.168.101.100:5000') // Replace with your server's address

export default function ExpoVoice() {
  const [recording, setRecording] = useState(null)
  const [transcription, setTranscription] = useState('')

  useEffect(() => {
    socket.on('transcription', text => {
      setTranscription(text)
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

      setRecording(null)
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text>Transcription: {transcription}</Text>
    </View>
  )
}
