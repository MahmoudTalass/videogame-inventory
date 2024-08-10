const asyncHandler = require("express-async-handler");
const { PlatformService } = require("../db/query");

const getAllPlatforms = asyncHandler(async (req, res) => {
   const platforms = await PlatformService.getAllPlatforms();

   res.render("category-list", { list: platforms, title: "Platforms list" });
});

const getAllGamesOnPlatform = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await PlatformService.getAllGamesOnPlatform(id);

   // display in view
});

module.exports = {
   getAllPlatforms,
};
