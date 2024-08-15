const asyncHandler = require("express-async-handler");
const { PlatformService, GameService } = require("../db/query");
const { validatePlatform } = require("../middlwares/validation");

const getAllPlatforms = asyncHandler(async (req, res) => {
   const platforms = await PlatformService.getAllPlatforms();

   res.render("category-list", { list: platforms, title: "Platforms list", category: "platforms" });
});

const getAllGamesOnPlatform = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { games, platformName } = await PlatformService.getAllGamesOnPlatform(id);

   res.render("games", {
      title: `Games on ${platformName}`,
      games,
   });
});

const createPlatformGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Platform" });
};

const createPlatformPost = [
   validatePlatform,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await PlatformService.createPlatform(name);

      res.redirect("/platforms");
   }),
];

const deletePlatform = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const gamesOnPlatform = await PlatformService.getAllGamesOnPlatform(id);

   if (gamesOnPlatform.length > 0) {
      return res.redirect(`/platforms`);
   }

   await PlatformService.deletePlatform(id);
   res.status(204).redirect("/platforms");
});

module.exports = {
   getAllPlatforms,
   createPlatformGet,
   createPlatformPost,
   getAllGamesOnPlatform,
   deletePlatform,
};
