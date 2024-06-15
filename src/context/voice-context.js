import { createContext } from 'react'

const VoiceContext = createContext({
  recognized: '',
  pitch: '',
  error: '',
  end: '',
  started: '',
  results: [],
  partialResults: [],
  isRecording: false,
  startRecognizing: () => {},
  stopRecognizing: () => {},
  cancelRecognizing: () => {},
  destroyRecognizer: () => {},
  speakResults: () => {}
})

export default VoiceContext
