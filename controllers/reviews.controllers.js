const { selectReviews, selectReviewById } = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((selectedReview) => {
      res.status(200).send({ selectedReview });
    })
    .catch(next);
};
