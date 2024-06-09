import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      uploadFile(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const uploadFile = async (uri) => {
    try {
      const formData = new FormData();

      formData.append('audio', {
        uri: uri,
        name: `${new Date().getTime()}.wav`,
        type: 'audio/wav',
      });

      const response = await axios.post('http://192.168.101.100:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      setUploadStatus(`Upload successful: ${response.data.text}`);
    } catch (error) {
      console.error(error);
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {uploadStatus ? <Text>{uploadStatus}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
