const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

const client = new SpeechClient({
  keyFilename: './read-book-4blind-aa98906744f6.json',
});
app.get('/test', (req, res)=>{
    res.json(1)
})

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    console.log('File path:', req.file.path);
    const file = fs.readFileSync(req.file.path);
    const audioBytes = file.toString('base64');
  
    const audio = {
    //   content: audioBytes,
        uri: 'gs://cloud-samples-data/speech/brooklyn_bridge.raw' // 'https://storage.googleapis.com/cloud-samples-data/speech/corbeau_renard.flac'
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
    try {
      const [response] = await client.recognize(request);
      console.log(JSON.stringify(response))
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
        console.log(transcription)
      res.json({ transcription });
    } catch (err) {
      console.error('Error during transcription:', err);
      res.status(500).send(err.toString());
    }
  });
  


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
