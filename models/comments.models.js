const { checkReviewExists, checkUserExists } = require("../db/seeds/utils");
const db = require("../db/connection.js");

exports.selectCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id)
    .then(() => {
      //We only execute this code if the specified review id exists
      return db.query(
        `
        SELECT * FROM comments
        WHERE review_id = $1;
        `,
        [review_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertCommentByReviewId = (review_id, comment) => {
  const { username, body } = comment;

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request",
    });
  }

  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Invalid request",
    });
  }

  return checkReviewExists(review_id)
    .then(() => {
      return checkUserExists(username);
    })
    .then(() => {
      return db.query(
        `
        INSERT INTO comments
        (body, review_id, author)
        VALUES
        ($1, $2, $3)
        RETURNING *;
       `,
        [body, review_id, username]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};
