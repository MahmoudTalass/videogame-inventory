const asyncHandler = require("express-async-handler");
const { GenreService } = require("../db/query");

const getAllGenres = asyncHandler(async (req, res) => {
   const genres = await GenreService.getAllGenres();

   res.render("category-list", { list: genres, title: "Genres list" });
});

const getAllGamesInGenre = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const games = await GenreService.getAllGamesInGenre();

   // display in view
});

module.exports = {
   getAllGenres,
};
