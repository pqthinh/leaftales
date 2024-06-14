import { useState, useEffect, useCallback } from 'react'
import * as Speech from 'expo-speech'

const useBookReader = chapterContent => {
  const [sentences, setSentences] = useState([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [playbackState, setPlaybackState] = useState('stopped') // stopped, playing, paused
  const [speechRate, setSpeechRate] = useState(1.0) // Tốc độ đọc mặc định
  const [volume, setVolume] = useState(1.0) // Âm lượng mặc định

  useEffect(() => {
    if (chapterContent) {
      // Tách đoạn văn thành mảng các câu
      const newSentences = chapterContent
        .split(/[.?!;]/)
        .filter(sentence => sentence.trim() !== '')
      setSentences(newSentences)
    }
  }, [chapterContent])

  const speak = sentence => {
    Speech.speak(sentence, {
      language: 'vi',
      rate: speechRate,
      onDone: () => {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(currentSentenceIndex + 1)
          // speak(sentences[currentSentenceIndex])
        } else {
          setPlaybackState('stopped') // Kết thúc đọc khi hết câu
        }
      }
    })
    setPlaybackState('playing')
  }

  const speakCurrentSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      speak(sentences[currentSentenceIndex])
      // setCurrentSentenceIndex(currentSentenceIndex + 1)
    }
  }, [sentences, currentSentenceIndex])

  const speakNextSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
      speak(sentences[currentSentenceIndex])
    }
  }, [sentences, currentSentenceIndex])

  const speakPreviousSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1)
      speak(sentences[currentSentenceIndex])
    }
  }, [sentences, currentSentenceIndex])

  const pauseSpeech = () => {
    Speech.pause()
    setPlaybackState('paused')
  }

  const resumeSpeech = () => {
    Speech.resume()
    setPlaybackState('playing')
  }

  const stopSpeech = () => {
    Speech.stop()
    setPlaybackState('stopped')
  }

  const adjustSpeed = newRate => {
    setSpeechRate(newRate)
  }

  const adjustVolume = newVolume => {
    setVolume(newVolume)
  }

  const goToSentence = index => {
    if (index >= 0 && index < sentences.length) {
      setCurrentSentenceIndex(index)
      speak(sentences[index])
    }
  }

  const getProgressPercentage = useCallback(() => {
    return Math.round((currentSentenceIndex / sentences.length) * 100)
  }, [currentSentenceIndex, sentences])

  return {
    sentences,
    currentSentenceIndex,
    playbackState,
    speechRate,
    volume,
    speakCurrentSentence,
    speakNextSentence,
    speakPreviousSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    adjustSpeed,
    adjustVolume,
    goToSentence,
    getProgressPercentage
  }
}

export default useBookReader
