const asyncHandler = require("express-async-handler");
const { PlatformService } = require("../db/query");
const { validatePlatform } = require("../middlwares/validation");

const getAllPlatforms = asyncHandler(async (req, res) => {
   const platforms = await PlatformService.getAllPlatforms();

   res.render("category-list", { list: platforms, title: "Platforms list" });
});

const getAllGamesOnPlatform = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await PlatformService.getAllGamesOnPlatform(id);

   res.render("games", {
      title: `Games on ${games[0].platform_name}`,
      games,
   });
});

const createPlatformGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Platform", category: "Platform" });
};

const createPlatformPost = [
   validatePlatform,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await PlatformService.createPlatform(name);

      res.redirect("/platforms");
   }),
];

module.exports = {
   getAllPlatforms,
   createPlatformGet,
   createPlatformPost,
   getAllGamesOnPlatform,
};
