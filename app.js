const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const usersRouter = require("./routes/users-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");
const commentsRouter = require("./routes/comments-router");
const {
  handleCustomErrors,
  handleDefaultErrors,
  handlePsqlErrors,
} = require("./errors");

app.use(express.json());

app.use("/", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/categories", categoriesRouter);

app.use("/api/reviews", reviewsRouter);

app.use("/api/comments", commentsRouter);

// Error Handling

// All bad paths
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});
// Custom Errors
app.use(handleCustomErrors);
// PSQL Errors
app.use(handlePsqlErrors);
// Default Errors
app.use(handleDefaultErrors);

module.exports = app;
