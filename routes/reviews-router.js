const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  patchReviewById,
  postReview,
  deleteReviewById,
} = require("../controllers/reviews.controllers");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("../controllers/comments.controllers");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .delete(deleteReviewById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
