const asyncHandler = require("express-async-handler");
const { DeveloperService } = require("../db/query");
const { validateDeveloper } = require("../middlwares/validation");

const getAllDevelopers = asyncHandler(async (req, res) => {
   const developers = await DeveloperService.getAllDevelopers();

   res.render("category-list", {
      list: developers,
      title: "Developers list",
      category: "developers",
   });
});

const getAllGamesByDeveloper = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { games, developerName } = await DeveloperService.getAllGamesByDeveloper(id);

   res.render("games", {
      title: `Games by ${developerName}`,
      games,
      category: "developers",
   });
});

const createDeveloperGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Developer" });
};

const createDeveloperPost = [
   validateDeveloper,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await DeveloperService.createDeveloper(name);

      res.redirect("/developers");
   }),
];

const deleteDeveloper = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { games: gamesByDeveloper } = await DeveloperService.getAllGamesByDeveloper(id);

   if (gamesByDeveloper.length > 0) {
      return res.redirect(`/developers`);
   }

   await DeveloperService.deleteDeveloper(id);
   res.status(204).redirect("/developers");
});

module.exports = {
   getAllDevelopers,
   getAllGamesByDeveloper,
   createDeveloperGet,
   createDeveloperPost,
   deleteDeveloper,
};
