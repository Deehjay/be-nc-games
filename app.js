const express = require("express");
const {
  getCategories,
  getReviews,
} = require("./controllers/categories.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

//error handling for all bad paths
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

//default error handling
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

module.exports = app;
