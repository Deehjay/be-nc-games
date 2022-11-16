const db = require("../db/connection.js");
const { checkReviewExists } = require("../db/seeds/utils.js");

exports.selectReviews = () => {
  return db
    .query(
      `
      SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY created_at DESC;
      `
    )
    .then((response) => {
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
