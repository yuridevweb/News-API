const { selectTopics, selectArticleById } = require('../models/news.models')

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics })
  })
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article })
    })
    .catch(next)
}
