const asyncHandler = require("express-async-handler");
const { DeveloperService } = require("../db/query");

const getAllDevelopers = asyncHandler(async (req, res) => {
   const developers = await DeveloperService.getAllDevelopers();

   res.render("category-list", { list: developers, title: "Developers list" });
});

const getAllGamesByDeveloper = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await DeveloperService.getAllGamesByDeveloper(id);

   // display in view
});

module.exports = {
   getAllDevelopers,
   getAllGamesByDeveloper,
};
