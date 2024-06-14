import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';

const useBookReader = (chapterContent) => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState('stopped'); // stopped, playing, paused
  const [speechRate, setSpeechRate] = useState(1.0); // Tốc độ đọc mặc định
  const [volume, setVolume] = useState(1.0); // Âm lượng mặc định

  useEffect(() => {
    if (chapterContent) {
      // Tách đoạn văn thành mảng các câu
      const newSentences = chapterContent.split(/[.?!;]/).filter(sentence => sentence.trim() !== '');
      setSentences(newSentences);
    }
  }, [chapterContent]);

  const speak = (sentence) => {
    Speech.speak(sentence, {
      language: 'vi',
      rate: speechRate,
      onDone: () => {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(currentSentenceIndex + 1);
          speak(sentences[currentSentenceIndex + 1]);
        } else {
          setPlaybackState('stopped'); // Kết thúc đọc khi hết câu
        }
      },
    });
    setPlaybackState('playing');
  };

  const speakNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      speak(sentences[currentSentenceIndex]);
    }
  };

  const speakPreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      speak(sentences[currentSentenceIndex]);
    }
  };

  const pauseSpeech = () => {
    Speech.pause();
    setPlaybackState('paused');
  };

  const resumeSpeech = () => {
    Speech.resume();
    setPlaybackState('playing');
  };

  const stopSpeech = () => {
    Speech.stop();
    setPlaybackState('stopped');
  };

  const adjustSpeed = (newRate) => {
    setSpeechRate(newRate);
  };

  const adjustVolume = (newVolume) => {
    setVolume(newVolume);
  };

  const goToSentence = (index) => {
    if (index >= 0 && index < sentences.length) {
      setCurrentSentenceIndex(index);
      speak(sentences[index]);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((currentSentenceIndex / sentences.length) * 100);
  };

  return {
    sentences,
    currentSentenceIndex,
    playbackState,
    speechRate,
    volume,
    speakNextSentence,
    speakPreviousSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    adjustSpeed,
    adjustVolume,
    goToSentence,
    getProgressPercentage,
  };
};

export default useBookReader;
