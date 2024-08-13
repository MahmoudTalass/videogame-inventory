const { Router } = require("express");
const router = Router();
const platformsController = require("../controllers/platform.controller");

// list all platforms
router.get("/", platformsController.getAllPlatforms);

// render new platform form
router.get("/create", platformsController.createPlatformGet);

// add new platform
router.post("/create", platformsController.createPlatformPost);

// list all games on a certain platform
router.get("/:id/games", platformsController.getAllGamesOnPlatform);

// delete platform
router.get("/:id");

module.exports = router;
