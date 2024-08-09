const { Router } = require("express");
const router = Router();
const indexController = require("../controllers/index.controller");

// list all categories and their counts
router.get("/", indexController.getInventoryCount);

module.exports = router;
