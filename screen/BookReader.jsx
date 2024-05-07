import React from 'react';
import { View, Text, Image, Button } from 'react-native'; // Assuming you're using React Native
import useBookReader from '../hooks/useBookReader'; // Path to your custom hook

const BookReader = ({ route }) => {
  const { content, cover, title } = route.params;
  const {
    chapterIndex,
    sentenceIndex,
    playbackState,
    speechRate,
    progressPercentage,
    speakNextSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    adjustSpeed,
    goToChapter,
    seekToSentence,
    updateProgress,
  } = useBookReader(content);

  const currentChapter = content[chapterIndex];
  const currentSentence = currentChapter.sentences[sentenceIndex];

  return (
    <View>
      {/* Display cover image */}
      <Image source={cover} style={{ width: 200, height: 300 }} />
      <Text>Title: {title}</Text>
      
      
      <Text>Chapter: {currentChapter.title}</Text>
      <Text>{currentSentence}</Text>


      <Text>Progress: {progressPercentage}%</Text>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Previous Sentence" onPress={() => seekToSentence(chapterIndex, Math.max(0, sentenceIndex - 1))} />
        <Button title="Pause" onPress={pauseSpeech} disabled={playbackState !== 'playing'} />
        <Button title="Play" onPress={speakNextSentence} disabled={playbackState === 'playing'} />
        <Button title="Next Sentence" onPress={() => speakNextSentence()} />
        <Button title="Go to Current Sentence" onPress={updateProgress} />
      </View>
    </View>
  );
};

export default BookReader;
