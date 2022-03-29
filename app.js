const express = require('express')
const { getTopics, getArticleById } = require('./controllers/news.controllers')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Path not found' })
})

//handle PSQL errors
app.use((err, req, res, next) => {
  const bedReqCodes = ['22P02']
  if (bedReqCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.log(err, '<<<error')
  res.sendStatus(500)
})

module.exports = app
