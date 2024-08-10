const { Router } = require("express");
const router = Router();
const platformsController = require("../controllers/platform.controller");

// list all platforms
router.get("/", platformsController.getAllPlatforms);

// list all games on a certain platform
router.get("/:id/games");

// delete platform
router.get("/:id");

module.exports = router;
