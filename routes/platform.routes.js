const { Router } = require("express");
const router = Router();
const platformsController = require("../controllers/platform.controller");

// list all platforms
router.get("/", platformsController.getAllPlatforms);

// render new platform form
router.get("/create", platformsController.createPlatformGet);

// add new platform
router.get("/create", platformsController.createPlatformGet);

// list all games on a certain platform
router.get("/:id/games");

// delete platform
router.get("/:id");

module.exports = router;
