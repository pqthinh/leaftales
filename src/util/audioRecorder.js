import { Audio } from 'expo-av';
import io from 'socket.io-client';
import { SOCKET_URL } from './config';

const socket = io(SOCKET_URL);

export async function startRecording() {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') throw new Error('Permission not granted');

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { sound: alertSound } = await Audio.Sound.createAsync(
      require('../assets/sound/bubble-pop-up-alert-notification.wav')
    );
    await alertSound.playAsync();

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await recording.startAsync();
    return recording;
  } catch (err) {
    console.error('Failed to start recording', err);
    throw err;
  }
}

export async function stopRecording(recording) {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const audioData = await fetch(uri);
    const blob = await audioData.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        socket.emit('audio-stream', { uri: base64data });
        socket.on('transcription', (text) => {
          resolve(text);
        });
        socket.on('error', (error) => {
          reject(error);
        });
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  } catch (err) {
    console.error('Failed to stop recording', err);
    throw err;
  }
}
