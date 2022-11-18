const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api.controllers");

apiRouter.route("/api").get(getApi);

apiRouter.route("/api/health").get((req, res) => {
  res.status(200).send({ msg: "Server up and running!" });
});

module.exports = apiRouter;
