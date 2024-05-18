import React from 'react';
import { View, Button, Text } from 'react-native';
import { useVoiceControl } from '../provider/VoiceProvider';

export const VoiceControlComponent = () => {
  const { 
    isRecording, 
    startRecognizing=(e)=>{console.log(e)}, 
    stopRecognizing=(e)=>{console.log(e)}, 
    results, 
    speakResults 
  } = useVoiceControl()

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={async (e) => isRecording ? await stopRecognizing(e) : await startRecognizing(e)}
      />
      <Button
        title="Speak Results"
        onPress={speakResults}
        disabled={results.length === 0}
      />
      <Text>Transcription:</Text>
      {results.map((result, index) => (
        <Text key={index}>{result}</Text>
      ))}
    </View>
  );
}