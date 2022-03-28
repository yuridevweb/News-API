const express = require('express');
const {getTopics} = require('./controllers/news.controllers');

const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);


app.all('/*', (req, res) => {
  res.status(404).send({ message: "Path not found" });
});


app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
