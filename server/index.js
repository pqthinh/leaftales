const express = require('express');
const speech = require('@google-cloud/speech').v1p1beta1;

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new speech.SpeechClient();

app.post('/transcribe', async (req, res) => {
  const { base64Audio } = req.body;
  // Decode base64 audio
//   const audioBuffer = Buffer.from(base64Audio, 'base64');
//   const audioContent = audioBuffer.toString('hex');

  const request = {
    audio: {
      content: base64Audio,
    },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'vi-VN',
    },
  };

  try {
    console.log(request)
    const [response] = await client.recognize(request);
    console.log(JSON.stringify(response))
    const transcript = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');
    res.json({ text: transcript });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error transcribing audio');
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
