const { checkReviewExists } = require("../db/seeds/utils");
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
