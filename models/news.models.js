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
