const db = require("../db/connection.js");

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
      SELECT * FROM reviews
      WHERE review_id = $1`,
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
