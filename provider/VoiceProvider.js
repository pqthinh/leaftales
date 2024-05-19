import React, { createContext, useState, useEffect, useContext } from 'react';
import Voice from '@react-native-voice/voice';
import { Button } from 'react-native'
import * as Speech from 'expo-speech';
// import * as Permissions from 'expo-permissions';
// import { Audio } from 'expo-av';

const initialState = {
  recognized: '',
  pitch: '',
  error: '',
  end: '',
  started: '',
  results: [],
  partialResults: [],
  isRecording: false,
};
export const VoiceControlContext = createContext(initialState);

export const VoiceControlProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const onSpeechStart = () => setState({ ...state, started: '√', isRecording: true });
    const onSpeechRecognized = () => setState({ ...state, recognized: '√' });
    const onSpeechEnd = () => setState({ ...state, end: '√', isRecording: false });
    const onSpeechError = (e) => setState({ ...state, error: JSON.stringify(e.error), isRecording: false });
    const onSpeechResults = (e) => setState({ ...state, results: e.value });
    const onSpeechPartialResults = (e) => setState({ ...state, partialResults: e.value });
    const onSpeechVolumeChanged = (e) => setState({ ...state, pitch: e.value });

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [state]);

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setState({ ...initialState, isRecording: true });
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setState({ ...state, isRecording: false });
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      setState({ ...state, isRecording: false });
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setState({ ...initialState });
    } catch (e) {
      console.error(e);
    }
  };

  const speakResults = () => {
    if (state.results.length > 0) {
      Speech.speak(state.results.join(' '));
    } else {
      Speech.speak('No transcription results available.');
    }
  };

  // const GetPermissions = async () => {
  //   try {
  //     // const requestPermissions = async () => {
  //     //   const { status: microphoneStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  //     //   const { status: speechStatus } = await Permissions.askAsync(Permissions.SPEECH);

  //     //   if (microphoneStatus === 'granted' && speechStatus === 'granted') {
  //     //     alert('granted');
  //     //   } else {
  //     //     alert('Permissions not granted');
  //     //   }
  //     // };
  //     // requestPermissions()

  //     // const AudioPerm = await Audio.requestPermissionsAsync();
  //     //     if (AudioPerm.status === 'granted') {
  //     //       console.log('Audio Permission Granted');
  //     //     }
  //   } catch (err) {
  //     console.error('Failed to get permissions', err);
  //   }
  // };

  return (
    <VoiceControlContext.Provider
      value={{
        ...state,
        startRecognizing,
        stopRecognizing,
        cancelRecognizing,
        destroyRecognizer,
        speakResults,
      }}
    >
      {children}
      {/* <Button title="Get Permissions" onPress={GetPermissions} /> */}
    </VoiceControlContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceControlContext)