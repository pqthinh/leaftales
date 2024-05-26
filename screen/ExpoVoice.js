// App.js
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { URL_NODE_SERVER } from '../util/config';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState("");

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      
      // Upload the audio file to the server
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      const response = await axios.post(`${URL_NODE_SERVER}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscript(response.data.transcript);

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
      <Text>{transcript}</Text>
    </View>
  );
}
