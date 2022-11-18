const {
  selectReviews,
  selectReviewById,
  updateReviewById,
  insertReview,
} = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  updateReviewById(review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const review = req.body;
  insertReview(review)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
