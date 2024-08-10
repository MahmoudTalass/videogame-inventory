const { Router } = require("express");
const router = Router();
const genresController = require("../controllers/genres.controller");

// list all genres
router.get("/", genresController.getAllGenres);

// list all games in a certain genre
router.get("/:id/games");

// delete platform
router.get("/:id");

module.exports = router;
