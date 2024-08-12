const { Router } = require("express");
const router = Router();
const gamesController = require("../controllers/games.controller");

// list all games
router.get("/", gamesController.getAllGames);

// create new game
router.get("/create", gamesController.createGameGet);

// update game info
router.post("/create", gamesController.createGamePost);

// get certain game
router.get("/:id", gamesController.getGame);

// delete game
router.post("/:id/delete");

module.exports = router;
