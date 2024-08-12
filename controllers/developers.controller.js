const asyncHandler = require("express-async-handler");
const { DeveloperService } = require("../db/query");
const { validateDeveloper } = require("../middlwares/validation");

const getAllDevelopers = asyncHandler(async (req, res) => {
   const developers = await DeveloperService.getAllDevelopers();

   res.render("category-list", { list: developers, title: "Developers list" });
});

const getAllGamesByDeveloper = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await DeveloperService.getAllGamesByDeveloper(id);

   res.render("games", { title: `Games by ${games[0].developer_name}`, games });
});

const createDeveloperGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Developer", category: "Developer" });
};

const createDeveloperPost = [
   validateDeveloper,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await DeveloperService.createDeveloper(name);

      res.redirect("/developers");
   }),
];

module.exports = {
   getAllDevelopers,
   getAllGamesByDeveloper,
   createDeveloperGet,
   createDeveloperPost,
};
