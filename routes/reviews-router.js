const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews.controllers");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("../controllers/comments.controllers");

reviewsRouter.route("/").get(getReviews);

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
