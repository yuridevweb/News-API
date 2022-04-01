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
exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  const validQueries = [
    'created_at',
    'comment_count',
    'votes',
    'topic',
    'title',
    'author',
    'article_id',
  ]
  if (!validQueries.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, message: 'Invalid sort_by' })
  }
  if (!['asc', 'desc'].includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, message: 'Invalid order query' })
  }

  let queryStr = `SELECT articles.article_id, articles.author, articles.created_at, 
                  articles.title, articles.topic, articles.votes,
                  COUNT(comments.comment_id) AS comment_count FROM articles
                  LEFT JOIN comments
                  ON comments.article_id = articles.article_id`
  const queryValues = []

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`
    queryValues.push(topic)
  }

  queryStr += ` GROUP BY articles.article_id 
                ORDER BY ${sort_by} ${order};`

  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Topic doesn't exist" })
    }
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

exports.removeComment = (comment_id) => {
  const text = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
  const values = [comment_id]
  return db.query(text, values).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Comment ${comment_id} doesn\'t exist!`,
      })
    }
    return result.rows
  })
}
