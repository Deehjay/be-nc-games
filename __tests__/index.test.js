const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/categories", () => {
  test("GET - 200: Responds with array of all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories.length).toBe(4);
        response.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET - 404: Responds with 404 not found error when passed a bad path", () => {
    return request(app)
      .get("/api/something_bad")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route does not exist");
      });
  });
});
