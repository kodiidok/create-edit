require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const Configuration = require('openai').Configuration;
const OpenAIApi = require('openai').OpenAIApi;
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        console.log(typeof process.env.MONGO_URI);
    })
    .catch(err => console.log(err));

const Schema = mongoose.Schema;
const responseSchema = new Schema({
    prompt: { type: String },
    status: { type: String },
    created: { type: Number },
    message: { type: String },
    total_tokens: { type: Number }
});
const Response = mongoose.model("Response", responseSchema);

const createAndSaveResponse = (apiResponse) => {
  return apiResponse.save()
      .then((savedData) => {
          return savedData;
      })
      .catch((err) => {
          console.error(err);
          throw err;
  });
};

const generateResponse = async ( parcel ) => {
  let res = '';

  const completion = await openai.createEdit({
    model: "text-davinci-edit-001",
    input: parcel,
    instruction: "Fix the spelling mistakes",
  });

  return completion;
};

app.get('/', (req, res) => {
  res.send('Hello, World!\nThis is the createEdit microservice');
});

app.post('/inputMsg', async (req, res) => {
  const { parcel } = req.body;
  console.log(parcel);
  if (!parcel) {
      return res.status(400).send({ status: 'failed'});
  }
  const response = await generateResponse(parcel);
  const apiResponse = new Response({
      prompt: parcel,
      status: 'recieved',
      created: response.data.created,
      message: response.data.choices[0].text,
      total_tokens: response.data.usage.total_tokens
  });
  createAndSaveResponse(apiResponse);
  console.log(apiResponse);
  res.status(200).send(apiResponse);
});

app.listen(process.env.PORT || 8081);
console.log(`App listening at http://localhost:${process.env.PORT || 8081}`);

module.exports = app;