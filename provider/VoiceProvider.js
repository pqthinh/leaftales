import React, { createContext, useState, useEffect, useContext } from 'react';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

const VoiceControlContext = createContext();

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

    const listenerFuncs = [
      onSpeechStart,
      onSpeechRecognized,
      onSpeechEnd,
      onSpeechError,
      onSpeechResults,
      onSpeechPartialResults,
      onSpeechVolumeChanged,
    ];

    const addListeners = () => listenerFuncs.forEach(Voice.onSpeech);
    const removeListeners = () => listenerFuncs.forEach(Voice.removeAllListeners);

    addListeners();
    return () => {
      Voice.destroy().then(removeListeners);
    };
  }, []);

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
    </VoiceControlContext.Provider>
  );
};

export const useVoiceControl = () => useContext(VoiceControlContext);
