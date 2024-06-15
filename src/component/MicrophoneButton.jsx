import React, { useState } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { startRecording, stopRecording } from '../util/audioRecorder.js'

const MicrophoneButton = ({ onStopRecording }) => {
  const [recording, setRecording] = useState(null)

  const handlePress = async () => {
    if (recording) {
      const text = await stopRecording(recording)
      onStopRecording(text)
      setRecording(null)
    } else {
      const newRecording = await startRecording()
      setRecording(newRecording)
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={handlePress}
        color='#6200EE'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default MicrophoneButton
