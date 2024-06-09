import { createContext } from 'react';

const VoiceContext = createContext({
  // Define the initial state of your voice control context here
  recognized: '',
  pitch: '',
  error: '',
  end: '',
  started: '',
  results: [],
  partialResults: [],
  isRecording: false,
  // Add functions for voice control actions here
  startRecognizing: () => {},
  stopRecognizing: () => {},
  cancelRecognizing: () => {},
  destroyRecognizer: () => {},
  speakResults: () => {},
});

export default VoiceContext;
