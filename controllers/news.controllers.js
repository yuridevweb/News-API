const {
  selectTopics,
  selectArticleById,
  commentsByArticle,
  updateArticle,
  selectUsers,
  selectArticles,
  selectComments,
  addComment,
  removeComment,
} = require('../models/news.models')

//Converting into Async
exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics()
    res.send({ topics })
  } catch (err) {
    next(err)
  }
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params

  const promises = [
    selectArticleById(article_id),
    commentsByArticle(article_id),
  ]

  Promise.all(promises)
    .then((results) => {
      const article = results[0]
      const { count } = results[1]
      article.comment_count = Number(count)
      res.status(200).send({ article, count })
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params
  const { inc_votes } = req.body
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users })
    })
    .catch(next)
}

/* exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    const promises = []
    articles.forEach((article) => {
      promises.push(commentsByArticle(article.article_id))
    })
    Promise.all(promises)
      .then((results) => {
        let articleWithComments = articles.map((article, index) => {
          article.comment_count = Number(results[index].count)
          return article
        })
        res.status(200).send({ articles: articleWithComments })
      })
      .catch(next)
  })
} */

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params
  selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch(next)
}
exports.postComment = (req, res, next) => {
  const { article_id } = req.params
  const { username, body } = req.body
  addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({})
    })
    .catch(next)
}
