const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/*", () => {
  test("GET - 404: Responds with 404 not found error when passed a bad path", () => {
    return request(app)
      .get("/api/something_bad")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route does not exist");
      });
  });
});

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
});

describe("/api/reviews", () => {
  test("GET - 200: Responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(13);
        response.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET - 200: Should sort by date in descending order as default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - 200: Responds with an an object corresponding to the queried review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        console.log(response.body.review);
        expect(response.body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("GET - 400: Responds with 400 bad request when queried an invalid id", () => {
    return request(app)
      .get("/api/reviews/notanid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("GET - 404: Responds with 404 not found when queried a valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/7777777")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("ID does not exist");
      });
  });
});
