const asyncHandler = require("express-async-handler");
const { GameService, PlatformService, GenreService, DeveloperService } = require("../db/query");
const { validateGameInput } = require("../middlwares/validation");

const getAllGames = asyncHandler(async (req, res) => {
   const games = await GameService.getAllGames();

   res.render("games", { title: "All Games", games });
});

const getGame = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const game = await GameService.getGame(id);

   res.render("game", { title: game.title, game });
});

const createGameGet = asyncHandler(async (req, res) => {
   const [genres, developers, platforms] = await Promise.all([
      GenreService.getAllGenres(),
      DeveloperService.getAllDevelopers(),
      PlatformService.getAllPlatforms(),
   ]);

   res.render("create-game-form", {
      title: "Add New Game",
      genres,
      developers,
      platforms,
   });
});

const createGamePost = [
   validateGameInput,
   asyncHandler(async (req, res) => {
      await GameService.createGame(req.body);

      res.redirect("/games");
   }),
];

module.exports = {
   getAllGames,
   getGame,
   createGameGet,
   createGamePost,
};
