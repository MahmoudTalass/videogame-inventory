const { Router } = require("express");
const router = Router();
const gamesController = require("../controllers/games.controller");

// list all games
router.get("/", gamesController.getAllGames);

// render create new game form
router.get("/create", gamesController.createGameGet);

// create new game
router.post("/create", gamesController.createGamePost);

// get certain game
router.get("/:id", gamesController.getGame);

// render update game form
router.get("/:id/update", gamesController.updateGameGet);

// update game
router.post("/:id/update", gamesController.updateGamePost);

// delete game
router.post("/:id/delete", gamesController.deleteGame);

module.exports = router;
