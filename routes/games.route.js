const { Router } = require("express");
const router = Router();
const gamesController = require("../controllers/games.controller");

// list all games
router.get("/", gamesController.getAllGames);

// get certain game
router.get("/:id", gamesController.getGame);

// update game info
router.post("/:id");

// delete game
router.post("/:id/delete");

module.exports = router;
