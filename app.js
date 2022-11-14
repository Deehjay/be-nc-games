const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviews,
  getReviewById,
} = require("./controllers/reviews.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

//error handling for all bad paths
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

//custom error handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

//error handling for psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else next(err);
});

//default error handling
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

module.exports = app;
