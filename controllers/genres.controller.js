const asyncHandler = require("express-async-handler");
const { GenreService } = require("../db/query");
const { validateGenre } = require("../middlwares/validation");

const getAllGenres = asyncHandler(async (req, res) => {
   const genres = await GenreService.getAllGenres();

   res.render("category-list", { list: genres, title: "Genres list", category: "genres" });
});

const getAllGamesInGenre = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { games, genreName } = await GenreService.getAllGamesInGenre(id);

   res.render("games", {
      title: `${genreName} Games`,
      games,
      category: "genres",
   });
});

const createGenreGet = (req, res) => {
   res.render("create-category-form", { title: "Add New Genre" });
};

const createGenrePost = [
   validateGenre,
   asyncHandler(async (req, res) => {
      const { name } = req.body;

      await GenreService.createGenre(name);

      res.redirect("/genres");
   }),
];

const deleteGenre = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { games: gamesInGenre } = await GenreService.getAllGamesInGenre(id);

   if (gamesInGenre.length > 0) {
      return res.redirect(`/genres`);
   }

   await GenreService.deleteGenre(id);
   res.status(204).redirect("/genres");
});

module.exports = {
   createGenreGet,
   createGenrePost,
   getAllGenres,
   getAllGamesInGenre,
   deleteGenre,
};
