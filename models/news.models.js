const db = require('../db/connection')

//Converting into Async
exports.selectTopics = async () => {
  const result = await db.query('SELECT * FROM topics')
  return result.rows
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

/* exports.selectArticles = () => {
  return db
    .query('SELECT * FROM articles ORDER BY created_at DESC;')
    .then((result) => {
      return result.rows
    })
} */
exports.selectArticles = () => {
  let queryStr = `SELECT articles.article_id, articles.author, articles.created_at, 
                  articles.title, articles.topic, articles.votes,
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`

  return db.query(queryStr).then((result) => {
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
