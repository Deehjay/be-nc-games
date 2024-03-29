const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const { response } = require("../app.js");

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
            comment_count: expect.any(Number),
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
  test("GET - 200: Selects only reviews with the specified category when queried", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(1);
        expect(response.body.reviews[0]).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          category: "dexterity",
          created_at: expect.any(String),
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("GET - 200: Works when queried a category with a space", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(11);
        response.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: "social deduction",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET - 200: Response is sorted by specified sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(13);
        expect(response.body.reviews).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("GET - 200: Response is sorted and ordered by specified sort_by and order", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count&order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(13);
        expect(response.body.reviews).toBeSortedBy("comment_count", {
          ascending: true,
        });
      });
  });
  test("GET 200: Works when queried all 3 valid queries", () => {
    return request(app)
      .get(
        "/api/reviews?category=social%20deduction&sort_by=comment_count&order=asc"
      )
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(11);
        response.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: "social deduction",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(response.body.reviews).toBeSortedBy("comment_count", {
          ascending: true,
        });
      });
  });
  test("GET - 200: Responds with an empty array when passed a valid category which has no associated reviews", () => {
    return request(app)
      .get("/api/reviews?category=children%27s%20games")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toEqual([]);
      });
  });
  test("GET - 400: Responds with 400 error when queried an invalid sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=something_bad")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort query");
      });
  });
  test("GET - 400: Responds with 400 error when queried an invalid order", () => {
    return request(app)
      .get("/api/reviews?order=something_bad")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid order query");
      });
  });
  test("GET - 400: Responds with 400 error when either sort_by or order are invalid", () => {
    return request(app)
      .get("/api/reviews?order=asc&sort_by=something_bad")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort query");
      });
  });
  test("GET - 404: Responds with 404 error when queried category does not exist", () => {
    return request(app)
      .get("/api/reviews?category=something_bad")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
  test("GET - 400: Responds with 400 error when any of the 3 queries are invalid", () => {
    return request(app)
      .get(
        "/api/reviews?category=social%20deduction&order=somethingbad&sort_by=title"
      )
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid order query");
      });
  });
  test("POST - 201: Responds with newly posted review", () => {
    const review = {
      owner: "mallionaire",
      title: "monopoly sucks",
      review_body: "monopoly is highly overrated",
      designer: "Lizzie Maggie",
      category: "social deduction",
    };
    return request(app)
      .post("/api/reviews")
      .send(review)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          owner: "mallionaire",
          review_body: "monopoly is highly overrated",
          title: "monopoly sucks",
          review_id: 14,
          category: "social deduction",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          created_at: expect.any(String),
          votes: 0,
          designer: "Lizzie Maggie",
          comment_count: 0,
        });
      });
  });
  test("POST - 201: Any extra keys are ignored", () => {
    const review = {
      owner: "mallionaire",
      title: "monopoly sucks",
      review_body: "monopoly is highly overrated",
      designer: "Lizzie Maggie",
      category: "social deduction",
      sneaky: 1,
    };
    return request(app)
      .post("/api/reviews")
      .send(review)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          owner: "mallionaire",
          review_body: "monopoly is highly overrated",
          title: "monopoly sucks",
          review_id: 14,
          category: "social deduction",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          created_at: expect.any(String),
          votes: 0,
          designer: "Lizzie Maggie",
          comment_count: 0,
        });
      });
  });
  test("POST - 400: Throws a 400 error if any of the required keys are not present", () => {
    const review = {
      owner: "mallionaire",
      // title: "monopoly sucks",
      review_body: "monopoly is highly overrated",
      designer: "Lizzie Maggie",
      category: "social deduction",
    };
    return request(app)
      .post("/api/reviews")
      .send(review)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid request");
      });
  });
  test("POST - 404: Throws a 404 error if all keys are passed and are valid, but either the owner or category is not found", () => {
    const review = {
      owner: "sneakybeaky",
      title: "monopoly sucks",
      review_body: "monopoly is highly overrated",
      designer: "Lizzie Maggie",
      category: "social deduction",
    };
    return request(app)
      .post("/api/reviews")
      .send(review)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("POST - 400: Throws a 400 error if owner and category both exist, but one of the other fields is empty", () => {
    const review = {
      owner: "sneakybeaky",
      title: "monopoly sucks",
      review_body: "",
      designer: "Lizzie Maggie",
      category: "social deduction",
    };
    return request(app)
      .post("/api/reviews")
      .send(review)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid request");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - 200: Responds with an an object corresponding to the queried review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
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
          comment_count: 0,
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
  test("PATCH - 200: Responds with updated review when given a positive inc_votes value", () => {
    const updatedReview = { inc_votes: 100 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(200)
      .then((response) => {
        expect(response.body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 101,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("PATCH - 200: Responds with correctly updated review when given a negative inc_votes value", () => {
    const updatedReview = { inc_votes: -2 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(200)
      .then((response) => {
        expect(response.body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: -1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("PATCH - 400: Throws a 400 error when body is missing required fields", () => {
    const updatedReview = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("PATCH - 400: Throws a 400 error when passed correct field but invalid type", () => {
    const updatedReview = { inc_votes: "definitelynotanumber" };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("PATCH - 400: Throws a 400 error when passed misspelled inc_votes", () => {
    const updatedReview = { inc_votesahhh: 100 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("PATCH - 200: Ignores any extra keys provided on the body", () => {
    const updatedReview = {
      inc_votes: 100,
      asurprise: "Please don't ignore me!",
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedReview)
      .expect(200)
      .then((response) => {
        expect(response.body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 101,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("PATCH - 400: Throws a 400 error when queried an invalid review ID", () => {
    const updatedReview = { inc_votes: 100 };
    return request(app)
      .patch("/api/reviews/somethingbad")
      .send(updatedReview)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("PATCH - 404: Throws a 404 error when queried a valid but non-existent ID", () => {
    const updatedReview = { inc_votes: 100 };
    return request(app)
      .patch("/api/reviews/1000")
      .send(updatedReview)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Review not found");
      });
  });
  test("DELETE - 204: Successfully deletes the queried article", () => {
    return request(app).delete("/api/reviews/1").expect(204);
  });
  test("DELETE - 400: Returns 400 error when passed a bat path", () => {
    return request(app)
      .delete("/api/reviews/notanid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("DELETE - 404: Returns a 404 error when passed a valid but non existent ID", () => {
    return request(app)
      .delete("/api/reviews/777777777")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET - 200: Responds with an array of comments for the specified review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(3);
        response.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: 3,
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET - 200: Responds with an empty array when queried review_id has no associated comments", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test("GET - 404: Responds with 404 error when specified review_id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Review not found");
      });
  });
  test("GET - 400: Responds with 400 error when passed a bad path", () => {
    return request(app)
      .get("/api/reviews/somethingbad/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("POST - 201: Responds with newly posted comment", () => {
    const newComment = { username: "mallionaire", body: "this is a comment" };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          review_id: 1,
          body: "this is a comment",
          author: "mallionaire",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("POST - 201: Successfully posted comment ignores any unnecessary properties on the body", () => {
    const newComment = {
      username: "mallionaire",
      body: "this is a comment",
      extrafield: "something random..",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          review_id: 1,
          body: "this is a comment",
          author: "mallionaire",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("POST - 400: Responds with 400 error when body is missing required fields", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("POST - 400: Responds with 400 error when body properties fail schema validation", () => {
    const newComment = { username: 1, body: 1 };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("POST - 400: Responds with 400 error when queried an invalid review id", () => {
    const newComment = { username: "mallionaire", body: "this is a comment" };
    return request(app)
      .post("/api/reviews/notanid/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("POST - 404: Responds with 404 error when trying to post using a username that is valid but does not exist", () => {
    const newComment = { username: "testusername", body: "This is a comment" };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User does not exist");
      });
  });
  test("POST - 404: Responds with 404 error when trying to post to a valid but non-existent ID", () => {
    const newComment = { username: "testusername", body: "This is a comment" };
    return request(app)
      .post("/api/reviews/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Review not found");
      });
  });
});

describe("/api/users", () => {
  test("GET - 200: Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE - 204: Successfully deletes the queried comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE - 400: Returns 400 error when passed a bad path", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  test("DELETE - 404: Returns a 404 error when passed a valid but non existent ID", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
  test("PATCH - 200: Responds with the comment object with newly updated votes", () => {
    const patchComment = { inc_votes: 100 };
    return request(app)
      .patch("/api/comments/1")
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "I loved this game too!",
          review_id: 2,
          author: "bainesface",
          votes: 116,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("PATCH - 200: Works with negative numbers passed as inc_votes", () => {
    const patchComment = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1")
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "I loved this game too!",
          review_id: 2,
          author: "bainesface",
          votes: 6,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("PATCH - 200: Ignores any extra keys on the body", () => {
    const patchComment = { inc_votes: -10, sneaky: "beaky" };
    return request(app)
      .patch("/api/comments/1")
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "I loved this game too!",
          review_id: 2,
          author: "bainesface",
          votes: 6,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("PATCH - 400: Responds with 400 error when passed a bad path", () => {
    const patchComment = { inc_votes: -10, sneaky: "beaky" };
    return request(app)
      .patch("/api/comments/foobar")
      .send(patchComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  test("PATCH - 404: Responds with 404 error when passed a valid but non existent id", () => {
    const patchComment = { inc_votes: -10, sneaky: "beaky" };
    return request(app)
      .patch("/api/comments/1000")
      .send(patchComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("/api", () => {
  test("GET - 200: Responds with a JSON of all available endpoints on the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = require("../endpoints.json");
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/health", () => {
  test("GET - 200: Responds with a server up and running msg", () => {
    return request(app)
      .get("/api/health")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Server up and running!");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET - 200: Responds with an object corresponding to the provided username", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET - 400: Responds with 400 error when passed an invalid username", () => {
    return request(app)
      .get("/api/users/123")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });
  test("GET - 404: Responds with 404 error when passed a valid but non existent id", () => {
    return request(app)
      .get("/api/users/a")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
