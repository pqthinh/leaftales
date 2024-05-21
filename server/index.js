const express = require('express');
const speech = require('@google-cloud/speech');
const fs = require("fs")
const bodyParser = require('body-parser');
const { audioToText }  = require('./model/speech2text')

const app = express();
app.use(bodyParser.json());

const client = new speech.SpeechClient();

app.post('/transcribe', async (req, res) => {
  const { base64Audio, uri } = req.body;
  let audioBuffer, audioContent
  // Decode base64 audio
  if(base64Audio) {
    audioBuffer = Buffer.from(base64Audio, 'base64');
    audioContent = audioBuffer.toString('hex');
  }
  if(uri) {
    const audioData = await fetch(uri).then(response => response.blob());
    audioBuffer = await audioData.arrayBuffer();
  }
  // fs.createWriteStream(`./audio-log/output-${new Date().getTime}.mp3`, audioBuffer, { encoding: 'binary' });

  const request = {
    audio: {
      content: audioBuffer,
    },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'vi-VN',
    },
  };

  try {
    console.log(request)
    // const [response] = await client.recognize(request);
    // console.log(JSON.stringify(response))
    // const transcript = response.results
    //   .map((result) => result.alternatives[0].transcript)
    //   .join('\n');
    // res.json({ text: transcript });
    res.json(1)
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error transcribing audio');
  }
});

app.post('/trans', audioToText)

app.listen(3000, () => console.log('Server listening on port 3000'));
