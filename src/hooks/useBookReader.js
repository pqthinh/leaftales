import React, { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';

const useBookReader = (bookData) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [index, setIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState('idle'); // idle, playing, paused
  const [speechRate, setSpeechRate] = useState(1); // Normalized between 0.25 and 4
  const [notes, setNotes] = useState([]); // Array of note objects
  const [bookmarks, setBookmarks] = useState([]); // Array of bookmarked chapter indices
  const [progressPercentage, setProgressPercentage] = useState(0); // Percentage read

  useEffect(() => {
    const isSpeechAvailable = async () => {
      try {
        const status = await Speech.getAvailableVoicesAsync();
        if (status.length === 0) {
          console.warn('Speech synthesis is not available');
        }
      } catch (error) {
        console.error('Error checking speech availability:', error);
      }
    };

    isSpeechAvailable();
  }, []);

  const speakNextSentence = async () => {
    if (playbackState === 'idle') {
      setPlaybackState('playing');
    }

    if (chapterIndex >= bookData.length || sentenceIndex >= bookData[chapterIndex].sentences.length) {
      console.warn('Reached the end of the book or chapter');
      setPlaybackState('idle');
      return;
    }

    const sentence = bookData[chapterIndex].sentences[sentenceIndex];
    try {
      Speech.speak(sentence, {
        rate: Math.max(0.25, Math.min(speechRate, 4)),
        onDone: () => {
          if (sentenceIndex < bookData[chapterIndex].sentences.length - 1) {
            setSentenceIndex(sentenceIndex + 1);
          } else if (chapterIndex < bookData.length - 1) {
            setChapterIndex(chapterIndex + 1);
            setSentenceIndex(0);
          } else {
            setPlaybackState('idle');
          }
          updateProgress();
        },
        onError: (error) => {
          console.error('Error speaking sentence:', error);
          setPlaybackState('idle');
          setIsSpeaking(false)
        },
        onStart: () => setIsSpeaking(true),
        onBoundary: (e) => {
          console.log("onBoundary -> ", e)
          setIndex(e.startIndex)
        }
      });
    } catch (error) {
      console.error('Error speaking sentence:', error);
      setPlaybackState('idle');
      setIsSpeaking(false)
    }
  };

  const pauseSpeech = () => {
    Speech.pause().then(() => setPlaybackState('paused'));
  };

  const resumeSpeech = () => {
    if (playbackState === 'paused') {
      Speech.resume().then(() => setPlaybackState('playing'));
    }
  };

  const stopSpeech = () => {
    Speech.stop().then(() => setPlaybackState('idle'));
    setSentenceIndex(0);
  };

  const adjustSpeed = (newRate) => {
    setSpeechRate(Math.max(0.25, Math.min(newRate, 4)));
  };

  const addNote = (noteText) => {
    const newNote = {
      chapterIndex,
      sentenceIndex,
      text: noteText,
      timestamp: Date.now(),
    };
    setNotes([...notes, newNote]);
  };

  const toggleBookmark = () => {
    const isBookmarked = bookmarks.includes(chapterIndex);
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((index) => index !== chapterIndex));
    } else {
      setBookmarks([...bookmarks, chapterIndex]);
    }
  };

  const goToChapter = (newChapterIndex) => {
    if (newChapterIndex >= 0 && newChapterIndex < bookData.length) {
      setChapterIndex(newChapterIndex);
      setSentenceIndex(0);
      setPlaybackState('idle');
    } else {
      console.warn('Invalid chapter index');
    }
  };

  const seekToSentence = (newChapterIndex, newSentenceIndex) => {
    if (
      newChapterIndex >= 0 &&
      newChapterIndex < bookData.length &&
      newSentenceIndex >= 0 &&
      newSentenceIndex < bookData[newChapterIndex].sentences.length
    ) {
      setChapterIndex(newChapterIndex);
      setSentenceIndex(newSentenceIndex);
      setPlaybackState('idle');
    } else {
      console.warn('Invalid chapter or sentence index');
    }
  };

  const updateProgress = () => {
    const totalSentences = bookData.reduce((acc, chapter) => acc + chapter.sentences.length, 0);
    const currentSentenceIndex = bookData.slice(0, chapterIndex).reduce((acc, chapter) => acc + chapter.sentences.length, 0) + sentenceIndex + 1;
    const percentage = (currentSentenceIndex / totalSentences) * 100;
    setProgressPercentage(percentage);
  };

  return {
    isSpeaking,
    chapterIndex,
    sentenceIndex,
    playbackState,
    speechRate,
    notes,
    bookmarks,
    progressPercentage,
    index,
    setIndex,
    setIsSpeaking,
    speakNextSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    adjustSpeed,
    addNote,
    toggleBookmark,
    goToChapter,
    seekToSentence,
  };
};

export default useBookReader;
