// server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express();
const port = 3000;
const OPEN_AI_KEY = "sk-proj-5Y7ATm7gW5anNb8Rp0OTT3BlbkFJNq7wxMLe0cNIIBeEm6rc"
const upload = multer({ dest: 'uploads/' });
const speech2text = require('./model/speech2text')
const client = new speech.SpeechClient();

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const audioBytes = (await fs.promises.readFile(file.path)).toString('base64');
    console.log(audioBytes)
    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'vi-VN',
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    console.log(`Transcription: ${transcription}`);
    res.json({transcription})
    // Send transcription to GPT-3 API
    // const gptResponse = await axios.post('https://api.openai.com/v1/completions', {
    //   model: 'text-davinci-003',
    //   prompt: `Given the transcription: "${transcription}", provide the appropriate action in JSON format.\nThe JSON should contain:\n- action: the type of action (e.g., "search", "open_book_detail_and_read")\n- book_name: the name of the book if applicable\nExample output: {"action": "search", "book_name": "cha giàu cha nghèo", "next_action": "open_book_detail_and_read"}`,
    //   max_tokens: 60,
    //   temperature: 0.7,
    //   n: 1,
    //   stop: ["\n"]
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${OPEN_AI_KEY}`,
    //   },
    // });

    // const action = gptResponse.data.choices[0].text.trim();
    // console.log(`Action: ${action}`);

    // res.json({ transcript: transcription, action: JSON.parse(action) });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});
app.get('/check', (req, res)=> res.json("ok"))
app.post('/covert-s2t', speech2text.audioToText)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
