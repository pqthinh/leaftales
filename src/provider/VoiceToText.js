import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceToText = ({ children }) => {
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    const initVoiceRecognition = async () => {
      try {
        await Voice.init({
          apiKey: '[YOUR_API_KEY]', // Thay thế bằng API key của bạn
          engines: [Voice.Engines.GOOGLE], // Sử dụng Google Speech Recognition
        });
        console.log('Khởi tạo nhận dạng giọng nói thành công');
      } catch (error) {
        console.error('Lỗi khởi tạo nhận dạng giọng nói:', error);
      }
    };

    initVoiceRecognition();

    const startRecognition = async () => {
      try {
        await Voice.start('en-US'); // Bắt đầu nhận dạng giọng nói với ngôn ngữ tiếng Anh (Mỹ)
        console.log('Bắt đầu nhận dạng giọng nói');
      } catch (error) {
        console.error('Lỗi bắt đầu nhận dạng giọng nói:', error);
      }
    };

    const stopRecognition = async () => {
      try {
        await Voice.stop();
        console.log('Dừng nhận dạng giọng nói');
      } catch (error) {
        console.error('Lỗi dừng nhận dạng giọng nói:', error);
      }
    };

    // Xử lý kết quả nhận dạng giọng nói
    Voice.onSpeechResults = (results) => {
      const lastResult = results[results.length - 1];
      setRecognizedText(lastResult.value);
    };

    // Xử lý sự kiện bắt đầu nhận dạng giọng nói
    Voice.onSpeechStart = () => {
      console.log('Bắt đầu nói');
    };

    // Xử lý sự kiện kết thúc nhận dạng giọng nói
    Voice.onSpeechEnd = () => {
      console.log('Kết thúc nói');
    };

    // Xử lý sự kiện lỗi nhận dạng giọng nói
    Voice.onError = (error) => {
      console.error('Lỗi nhận dạng giọng nói:', error);
    };

    return () => {
      // Dọn dẹp khi component bị hủy
      Voice.destroy().then(() => {
        console.log('Hủy nhận dạng giọng nói');
      });
    };
  }, []);

  const handleStartRecognition = () => {
    startRecognition();
  };

  const handleStopRecognition = () => {
    stopRecognition();
  };

  return (
    <View>
      <Text>Văn bản được nhận dạng: {recognizedText}</Text>
      <Button title="Bắt đầu" onPress={handleStartRecognition} />
      <Button title="Kết thúc" onPress={handleStopRecognition} />
      {children}
    </View>
  );
};

export default VoiceToText;
