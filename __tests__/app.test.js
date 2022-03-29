const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
  if (db.end) db.end()
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
  test('status:200, matching article object with comment_count', () => {
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

describe('GET /api/topics', () => {
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
