const { Router } = require("express");
const router = Router();
const genresController = require("../controllers/genres.controller");

// list all genres
router.get("/", genresController.getAllGenres);

// render new genre form
router.get("/create", genresController.createGenreGet);

// add new genre
router.post("/create", genresController.createGenrePost);

// list all games in a certain genre
router.get("/:id/games", genresController.getAllGamesInGenre);

// delete genre
router.post("/:id/delete", genresController.deleteGenre);

module.exports = router;
