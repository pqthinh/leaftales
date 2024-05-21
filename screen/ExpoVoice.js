import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { SPEECH_TO_TEXT } from '../util/config';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState('');
  const [transcription, setTranscription] = useState('');
  const [sound, setSound] = useState();

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setRecordingUri(uri);
  };

  const sendAudioToServer = async () => {
    if (!recordingUri) return;

    try {
      const audioBase64 = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(audioBase64)

      const response = await fetch(SPEECH_TO_TEXT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Audio: audioBase64 }),
        // body: JSON.stringify({uri: recordingUri})
      });
    //   console.log("audioBase64: ", audioBase64)
      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Error sending audio to server:', error);
    }
  };

  const playSound = async () => {
    if (!recordingUri) {
      Alert.alert('No recording found', 'Please record something first!');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
       <Button title="Play Recording" onPress={playSound} disabled={!recordingUri} />
      <Button title="Send to Server" onPress={sendAudioToServer} disabled={!recordingUri} />
      {transcription ? <Text>Transcription: {transcription}</Text> : null}
    </View>
  );
}
