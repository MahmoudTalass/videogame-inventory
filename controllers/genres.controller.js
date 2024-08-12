const asyncHandler = require("express-async-handler");
const { GenreService } = require("../db/query");
const { validateGenre } = require("../middlwares/validation");

const getAllGenres = asyncHandler(async (req, res) => {
   const genres = await GenreService.getAllGenres();

   res.render("category-list", { list: genres, title: "Genres list" });
});

const getAllGamesInGenre = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await GenreService.getAllGamesInGenre(id);

   res.render("games", {
      title: `${games[0].genre_name} Games`,
      games,
   });
});

const createGenreGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Genre", category: "Genre" });
};

const createGenrePost = [
   validateGenre,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await GenreService.createGenre(name);

      res.redirect("/genres");
   }),
];

module.exports = {
   createGenreGet,
   createGenrePost,
   getAllGenres,
};
