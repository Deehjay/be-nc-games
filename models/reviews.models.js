const db = require("../db/connection.js");
const { checkReviewExists, checkIfExists } = require("../db/seeds/utils.js");

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
  const validColumns = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];

  let queryValues = [];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `
    SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
   `;

  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then((response) => {
    if (!response.rows.length) {
      return checkIfExists("categories", "slug", category).then(() => {
        return [];
      });
    }
    return response.rows;
  });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `
      SELECT reviews.owner, review_body, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then((response) => {
      const review = response.rows[0];
      if (!review) {
        return Promise.reject({ status: 404, msg: "ID does not exist" });
      }
      return review;
    });
};

exports.updateReviewById = (review_id, updateInfo) => {
  const { inc_votes } = updateInfo;

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  return checkReviewExists(review_id)
    .then(() => {
      return db.query(
        `
      UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;
      `,
        [inc_votes, review_id]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.insertReview = (review) => {
  const { owner, title, review_body, designer, category } = review;

  if (!owner || !title || !review_body || !designer || !category) {
    return Promise.reject({ status: 400, msg: "invalid request" });
  }
  return checkIfExists("users", "username", owner)
    .then(() => {
      return checkIfExists("categories", "slug", category);
    })
    .then(() => {
      return db.query(
        `
      INSERT INTO reviews
      (owner, title, review_body, designer, category)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
        [owner, title, review_body, designer, category]
      );
    })
    .then((res) => {
      return db.query(
        `
      SELECT reviews.owner, review_body, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
        [res.rows[0].review_id]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.removeReviewById = (review_id) => {
  return checkIfExists("reviews", "review_id", review_id).then(() => {
    return db
      .query(
        `DELETE FROM comments
       WHERE review_id = $1`,
        [review_id]
      )
      .then(() => {
        return db.query(
          `DELETE from reviews
        WHERE review_id = $1`,
          [review_id]
        );
      });
  });
};
