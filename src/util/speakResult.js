import * as Speech from 'expo-speech';

async function speakResult(result, type = 'success', language = 'vi') {
  let message = '';

  switch (type) {
    case 'success':
      message = `Thành công: ${result}`;
      break;
    case 'error':
      message = `Lỗi: ${result}`;
      break;
    case 'info':
      message = result;
      break;
    default:
      message = result;
  }

  try {
    await Speech.speak(message, { language });
  } catch (error) {
    console.error('Lỗi khi đọc thông báo:', error);
  }
}

export default speakResult