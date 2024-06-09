import React, { useState, useEffect } from 'react';
import { Voice } from '@react-native-voice/voice';

const useVoiceControl = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = async () => {
    try {
      await Voice.requestPermissions();
      setIsListening(true);
      setRecognizedText(''); // Clear previous recognition
      const results = await Voice.start('en-US'); // Specify language code (optional)
      setRecognizedText(results[0].transcript); // Set recognized text
    } catch (e) {
      console.error('Error starting voice recognition:', e);
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  useEffect(() => {
    // Handle app lifecycle events (optional)
    return () => {
      stopListening(); // Stop listening when component unmounts
    };
  }, []);

  return { recognizedText, isListening, startListening, stopListening };
};

export default useVoiceControl;