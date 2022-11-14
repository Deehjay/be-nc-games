const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    return response.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT owner, title, review_id, category, review_img_url, created_at, votes, designer, COUNT(review_id) AS comment_count
       FROM reviews GROUP BY owner, title, review_id, category, review_img_url, created_at, votes, designer
       ORDER BY created_at DESC;
       `
    )
    .then((response) => {
      return response.rows;
    });
};
