const { Router } = require("express");
const router = Router();
const developersController = require("../controllers/developers.controller");

// list all developers
router.get("/", developersController.getAllDevelopers);

// list all games by a developer
router.get("/:id/games", developersController.getAllGamesByDeveloper);

// delete developer
router.get("/:id/delete");

module.exports = router;
