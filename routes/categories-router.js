const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories.controllers");

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
