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
        })
      })
  })

  test('400, when article ID is not an integer', () => {
    return request(app)
      .get('/api/articles/notAnID')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`)
      })
  })
})
