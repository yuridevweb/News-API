const cors = require('cors')
const express = require('express')
const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  getArticles,
  getCommentsByArticle,
  postComment,
  deleteComment,
} = require('./controllers/news.controllers')
const { getAllEndpoints } = require('./controllers/api.controllers')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api', getAllEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)
app.post('/api/articles/:article_id/comments', postComment)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)
//Errors handling

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Path not found' })
})

//handle PSQL errors
app.use((err, req, res, next) => {
  const bedReqCodes = ['22P02', '23503']
  if (bedReqCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' })
  } else {
    next(err)
  }
})

//handle custom errors
app.use((err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.log(err, '<<<error')
  res.sendStatus(500)
})

module.exports = app
