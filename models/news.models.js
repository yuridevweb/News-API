const db = require('../db/connection')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics').then((result) => {
    return result.rows
  })
}

exports.selectArticleById = (article_id) => {
  const text = `SELECT * FROM articles WHERE article_id = $1;`
  const values = [article_id]
  return db.query(text, values).then((result) => {
    return result.rows[0]
  })
}

exports.commentsByArticle = (article_id) => {
  const text = `SELECT COUNT(*) FROM comments WHERE article_id = $1;`
  const values = [article_id]
  return db.query(text, values).then((result) => {
    return result.rows[0]
  })
}

exports.updateArticle = (article_id, inc_votes) => {
  const text =
    'UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;'
  const values = [article_id, inc_votes]
  if (inc_votes === undefined) {
    return Promise.reject({ message: 'Invalid request', status: 400 })
  }
  return db.query(text, values).then((result) => {
    return result.rows[0]
  })
}

exports.selectUsers = () => {
  return db.query('SELECT * FROM users').then((result) => {
    return result.rows
  })
}

exports.selectArticles = () => {
  return db.query('SELECT * FROM articles').then((result) => {
    return result.rows
  })
}
exports.selectComments = (article_id) => {
  const text = `SELECT * FROM comments WHERE article_id = $1;`
  const values = [article_id]
  return db.query(text, values).then((result) => {
    return result.rows
  })
}

exports.addComment = (article_id, username, body) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, message: 'Bad request' })
  }
  const text = `INSERT INTO comments ( author, body, article_id)
  VALUES($1, $2, $3) RETURNING *;`
  const values = [username, body, article_id]

  return db.query(text, values).then((result) => {
    return result.rows[0]
  })
}
