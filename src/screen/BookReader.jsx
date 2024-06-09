import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native'; // Assuming you're using React Native
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
    <View style={styles.container}>
      <Image source={{uri: cover}} style={styles.coverBook} />
      <Text>Title: {title}</Text>
      
      
      <Text>Chapter: {currentChapter.title}</Text>
      <Text>{currentSentence}</Text>

      <Text>Progress: {progressPercentage}%</Text>


      <View style={styles.function}>
        <Button title="Previous Sentence" onPress={() => seekToSentence(chapterIndex, Math.max(0, sentenceIndex - 1))} />
        <Button title="Pause" onPress={pauseSpeech} disabled={playbackState !== 'playing'} />
        <Button title="Play" onPress={speakNextSentence} disabled={playbackState === 'playing'} />
        <Button title="Next Sentence" onPress={() => speakNextSentence()} />
        <Button title="Go to Current Sentence" onPress={updateProgress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10
  },
  coverBook: {
    width: '80%',
    height: 150,
    objectFit: "cover"
  },
  function: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  }
})
export default BookReader;
