const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
  if (db.end) db.end();
});

describe('1. GET /api/topics', () => {
  test('status:200, responds with an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
    });
    test("status 404 respondes with a message path not found", () => {
    return request(app)
      .patch("/api/invalid")
      .expect(404)
      .then((res) => {
        expect(res.body).toMatchObject({ message: "Path not found" });
      });
  });
});