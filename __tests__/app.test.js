const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const getAllEndpoints = require('../endpoints.json')

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
  if (db.end) db.end()
})

describe.only('GET /api', () => {
  test('returns a JSON containing all of the available endpoints on the API', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(getAllEndpoints)
      })
  })
})
describe('GET /api/topics', () => {
  test('status:200, responds with an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body
        expect(topics).toBeInstanceOf(Array)
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          )
        })
      })
  })
  test('status:404 respondes with a message path not found', () => {
    return request(app)
      .patch('/api/invalid')
      .expect(404)
      .then((res) => {
        expect(res.body).toMatchObject({ message: 'Path not found' })
      })
  })
})

describe('GET /api/articles/:article_id', () => {
  test('status:200, responds with single matching article object', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toEqual({
          article_id: 3,
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          votes: 0,
          comment_count: 2,
        })
      })
  })
  /*   test('status:200, matching article object with comment_count', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { count } = body
        expect(count).toBe(2)
      })
  }) */

  test('status:400, when article ID is not an integer', () => {
    return request(app)
      .get('/api/articles/notAnID')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`)
      })
  })
})

describe('PATCH /api/articles/:article_id', () => {
  test('status:200, responds with updated article object', () => {
    const newVote = {
      inc_votes: 5,
    }
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toEqual({
          article_id: 3,
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          votes: 5,
        })
      })
  })

  test('status:200, negative vote (downvote) works too', () => {
    const newVote = {
      inc_votes: -5,
    }
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toEqual({
          article_id: 3,
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          votes: -5,
        })
      })
  })

  test('status: 400 respondes with a message for invalid article data property', () => {
    const articleData = {
      post_code: 'AA12BB',
    }
    return request(app)
      .patch('/api/articles/3')
      .send(articleData)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({ message: 'Invalid request' })
      })
  })
})

describe('GET /api/users', () => {
  test('status:200, responds with an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body
        expect(users).toBeInstanceOf(Array)
        expect(users).toHaveLength(4)
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          )
        })
      })
  })
})

describe('GET /api/articles', () => {
  test('status:200, responds with an array of article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles).toBeInstanceOf(Array)
        expect(articles).toHaveLength(12)
        articles.forEach((article) => {
          expect(article).not.toHaveProperty('body')
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          )
        })
      })
  })
  test('200: articles sorted by date in descending order.', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy('created_at', {
          descending: true,
        })
      })
  })

  test('200: sorts the articles by any valid column (defaults to date)', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy('votes', { descending: true })
      })
  })
  test('200: sorts by order, which can be set, defaults to descending', () => {
    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy('created_at')
      })
  })

  test('200: filters by topic and sorts by given order, column', () => {
    return request(app)
      .get('/api/articles?order=asc&sort_by=title&topic=mitch')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy('title')
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch')
        })
      })
  })

  test('400: responds with error message when passed bad order request', () => {
    return request(app)
      .get('/api/articles?order=invalid_order')
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid order query')
      })
  })

  test('400: responds with error message when passed bad sort by', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid')
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid sort_by')
      })
  })

  test('Status:404, responds with an error given not existing filter query', () => {
    return request(app)
      .get('/api/articles?topic=not_exist')
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Topic doesn't exist")
      })
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  test('status:200, responds with array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          )
        })
      })
  })
  test('status:400, when article ID is not an integer', () => {
    return request(app)
      .get('/api/articles/notAnID/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`)
      })
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  test('status:201, responds with the object of posted comment', () => {
    const commentData = {
      username: 'rogersop',
      body: 'British following properties',
    }
    return request(app)
      .post('/api/articles/3/comments')
      .send(commentData)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          comment: {
            comment_id: 19,
            article_id: 3,
            votes: 0,
            created_at: expect.any(String),
            author: 'rogersop',
            body: 'British following properties',
          },
        })
      })
  })
  test('Status:400, when invalid article_id is passed', () => {
    const commentData = {
      username: 'rogersop',
      body: 'British following properties',
    }
    return request(app)
      .post('/api/articles/333/comments')
      .send(commentData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request')
      })
  })

  test('Status:400, responds with error if incorrect data passed.', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad request')
      })
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  test('Status:204, delete the given comment by comment_id', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(() => {
        return db.query('SELECT * FROM comments WHERE comment_id = 1')
      })
      .then((res) => {
        expect(res.rows).toEqual([])
      })
  })
  test("status:404 respondes with an error if comment_id doesn't exist yet", () => {
    const comment_id = '3333'
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: `Comment ${comment_id} doesn\'t exist!`,
        })
      })
  })
  test('status:400 respondes with an error if comment_id is invalid', () => {
    const comment_id = 'notAnID'
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          msg: `Bad request`,
        })
      })
  })
})
/* Refactoring:
-Change .message to .msg
-Remove console.logs / commented out lines
-Restructure Tests
-Follow best practise @at git
-Change to async
 */
