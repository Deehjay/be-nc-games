const {
  checkReviewExists,
  checkUserExists,
  checkIfExists,
} = require("../db/seeds/utils");
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

exports.removeCommentById = (comment_id) => {
  return checkIfExists("comments", "comment_id", comment_id).then(() => {
    return db.query(
      `DELETE FROM comments
       WHERE comment_id = $1`,
      [comment_id]
    );
  });
};

exports.patchCommentById = (comment_id, votes) => {
  const { inc_votes } = votes;
  return checkIfExists("comments", "comment_id", comment_id)
    .then(() => {
      return db.query(
        `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;
      `,
        [inc_votes, comment_id]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};
