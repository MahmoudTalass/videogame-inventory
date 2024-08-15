const { Router } = require("express");
const router = Router();
const developersController = require("../controllers/developers.controller");

// list all developers
router.get("/", developersController.getAllDevelopers);

// render new developer form
router.get("/create", developersController.createDeveloperGet);

// add new developer
router.post("/create", developersController.createDeveloperPost);

// list all games by a developer
router.get("/:id/games", developersController.getAllGamesByDeveloper);

// delete developer
router.post("/:id/delete", developersController.deleteDeveloper);

module.exports = router;
