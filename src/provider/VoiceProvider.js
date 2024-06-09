import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

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
      Voice.onSpeechStart = undefined;
      Voice.onSpeechRecognized = undefined;
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechError = undefined;
      Voice.onSpeechResults = undefined;
      Voice.onSpeechPartialResults = undefined;
      Voice.onSpeechVolumeChanged = undefined;
      Voice.removeAllListeners
    };
  }, [state]);

  const startRecognizing = async () => {
    try {
      await Voice.onSpeechStart('vi-VN');
      setState({ ...initialState, isRecording: true });
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async (e) => {
    try {
      await Voice.onSpeechEnd();
      console.log(e)
      await Voice.onSpeechResults(e)
      setState({ ...state, isRecording: false });
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.onSpeechEnd();
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

export const useVoice = () => useContext(VoiceControlContext)